/**
 * 
 * @On(event = { "CREATE" }, entity = "sapbuild_bonusbarcodeSrv.Purchases")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 * @param {Function} next - Callback function to the next handler
*/
module.exports = async function(request, next) {
    const { Purchases, Customers } = cds.entities;
    const purchaseData = request.data;

    if (!purchaseData || !purchaseData.purchaseValue || !purchaseData.customer_ID) {
        return next();
    }

    // Calculate reward points as one-tenth of the purchase value
    purchaseData.rewardPoints = Math.floor(purchaseData.purchaseValue / 10);

    // Update the purchase data with calculated reward points
    request.data = purchaseData;

    // Update the related customer's total purchase value and total reward points
    const customerUpdate = {
        totalPurchaseValue: { '+=': purchaseData.purchaseValue },
        totalRewardPoints: { '+=': purchaseData.rewardPoints }
    };

    await UPDATE(Customers).set(customerUpdate).where({ ID: purchaseData.customer_ID });

    return next();
}