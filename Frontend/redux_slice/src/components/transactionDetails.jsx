import { React, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTransactionDetails } from "../redux/action/inventoryAction";
import { selectInventoryMessage, selectInventoryLoading, selectInventoryError, selectTransactions } from "../redux/selector/selector";

const TransactionDetails = () => {
    const { sku } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector(selectInventoryLoading);
    const error = useSelector(selectInventoryError);
    const message = useSelector(selectInventoryMessage);
    const transactions = useSelector(selectTransactions);

    useEffect(() => {
        dispatch(fetchTransactionDetails(sku));
    }, [dispatch, sku]);

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-xl text-[16px] rounded-lg overflow-hidden m-6">
            <div className="bg-gray-800 py-4 px-6 border-b">
                <h2 className="font-bold text-white">Transaction Details for SKU: {sku}</h2>
            </div>
            <div className="p-6">
                {loading && (
                    <div className="text-blue-500 text-center mb-6 py-2 bg-blue-50 rounded-md">
                        <span className="font-medium">Loading...</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
                        <strong className="font-bold">Success: </strong>
                        <span>{message}</span>
                    </div>
                )}

                {/* Move the button here, above the transaction table */}
                <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded-md mb-4"
                    onClick={() => navigate(`/dashboard/inventory-details/analytics/${sku}`)} 
                >
                    Transaction Analytics
                </button>

                {transactions.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Type</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Date</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.transaction_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transaction_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.transaction_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-5xl mb-4">📄</div>
                        <p className="text-gray-500 text-lg">No transactions available for this SKU.</p>
                    </div>
                )}
                <div className="text-center mt-4">
            <button 
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
                onClick={() => navigate(`/dashboard/view-product/${sku}`)} 
            >
                Back to Product Categories
            </button>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetails;
