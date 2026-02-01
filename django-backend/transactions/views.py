from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from datetime import datetime
from bson import ObjectId

def get_db_collection():
    return settings.TRANSACTIONS_COLLECTION

@api_view(['POST'])
def add_transaction(req):
    user_id = req.headers.get('X-User-ID')
    if not user_id:
        print("Unauthorized: X-User-ID header missing", flush=True)
        return Response({"error": "Unauthorized: Missing X-User-ID header"}, status=401)
    
    data = req.data
    print(f"Adding transaction for user {user_id}: {data}", flush=True)
    
    transaction_type = data.get('type') # 'debit' or 'credit'
    amount = data.get('amount')
    details = data.get('details', '')

    if not transaction_type or amount is None:
        return Response({"error": "Type and amount are required"}, status=400)
    
    try:
        amount = float(amount)
        collection = get_db_collection()
        if collection is None:
            return Response({"error": "Database connection not initialized. Please check MONGO_URI in Render dashboard."}, status=503)
        
        # Get last balance for this user
        last_transaction = collection.find_one(
            {"user_id": user_id},
            sort=[("timestamp", -1)]
        )
        
        current_balance = last_transaction.get('balance_after', 0) if last_transaction else 0
        
        if transaction_type == 'credit':
            new_balance = current_balance + amount
        else: # debit
            new_balance = current_balance - amount
            
        transaction = {
            "user_id": user_id,
            "type": transaction_type,
            "amount": amount,
            "details": details,
            "balance_after": new_balance,
            "timestamp": datetime.utcnow()
        }
        
        collection.insert_one(transaction)
        
        return Response({"msg": "Transaction added successfully", "new_balance": new_balance})
    except ValueError:
        return Response({"error": "Invalid amount format"}, status=400)
    except Exception as e:
        print(f"Database error in add_transaction: {str(e)}", flush=True)
        return Response({"error": f"Database error: {str(e)}"}, status=500)

@api_view(['GET'])
def get_history(req):
    user_id = req.headers.get('X-User-ID')
    if not user_id:
        return Response({"error": "Unauthorized"}, status=401)
    
    collection = get_db_collection()
    if collection is None:
        return Response({"error": "Database connection not initialized"}, status=503)
    transactions = list(collection.find({"user_id": user_id}).sort("timestamp", -1))
    
    for t in transactions:
        t['_id'] = str(t['_id'])
        
    return Response(transactions)

@api_view(['GET'])
def get_summary(req):
    user_id = req.headers.get('X-User-ID')
    if not user_id:
        return Response({"error": "Unauthorized"}, status=401)
    
    collection = get_db_collection()
    if collection is None:
        return Response({"error": "Database connection not initialized"}, status=503)
    
    # Calculate totals
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$group": {
            "_id": "$type",
            "total": {"$sum": "$amount"}
        }}
    ]
    
    totals = list(collection.aggregate(pipeline))
    
    summary = {
        "total_credit": 0,
        "total_debit": 0,
        "balance": 0
    }
    
    for item in totals:
        if item['_id'] == 'credit':
            summary['total_credit'] = item['total']
        elif item['_id'] == 'debit':
            summary['total_debit'] = item['total']
            
    # Current balance from last transaction
    last_transaction = collection.find_one(
        {"user_id": user_id},
        sort=[("timestamp", -1)]
    )
    summary['balance'] = last_transaction.get('balance_after', 0) if last_transaction else 0
    
    return Response(summary)

@api_view(['GET'])
def get_status(req):
    import os
    from django.conf import settings
    
    mongo_uri = os.environ.get('MONGO_URI', 'NOT SET')
    status_code = 200
    db_status = "Unknown"
    
    try:
        from pymongo import MongoClient
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        client.admin.command('ping')
        db_status = "Connected"
    except Exception as e:
        db_status = f"Failed: {str(e)}"
        status_code = 500
        
    return Response({
        "status": "Alive",
        "mongo_uri_present": mongo_uri != 'NOT SET',
        "mongo_uri_obfuscated": mongo_uri[:15] + "..." if len(mongo_uri) > 15 else mongo_uri,
        "database_connectivity": db_status,
        "django_debug": settings.DEBUG,
        "details": "This endpoint helps debug Render connectivity issues."
    }, status=status_code)
