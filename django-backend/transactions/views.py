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
        return Response({"error": "Unauthorized"}, status=401)
    
    data = req.data
    transaction_type = data.get('type') # 'debit' or 'credit'
    amount = float(data.get('amount', 0))
    details = data.get('details', '')
    
    collection = get_db_collection()
    
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
    
    return Response({"msg": "Transaction added", "new_balance": new_balance})

@api_view(['GET'])
def get_history(req):
    user_id = req.headers.get('X-User-ID')
    if not user_id:
        return Response({"error": "Unauthorized"}, status=401)
    
    collection = get_db_collection()
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
