/**
 * 
 * @On(event = { "CREATE" }, entity = "sapbuild_bonusbarcodeSrv.Redemptions")
 * @param {cds.Request} request - User information, tenant-specific CDS model, headers and query parameters
 * @param {Function} next - Callback function to the next handler
*/
module.exports = async function(request, next) {
    const { Redemptions, Customers } = cds.entities;
    const { customer_ID, redeemedAmount } = request.data;

    if (!customer_ID || redeemedAmount === undefined) {
        return request.reject(400, "Invalid request data");
    }

    const customer = await SELECT.one.from(Customers).where({ ID: customer_ID });

    if (!customer) {
        return request.reject(404, "Customer not found");
    }

    if (redeemedAmount > customer.totalRewardPoints) {
        return request.reject(400, "Customer does not have enough points");
    }

    customer.totalRewardPoints -= redeemedAmount;
    customer.totalRedeemedRewardPoints += redeemedAmount;

    await UPDATE(Customers).set({
        totalRewardPoints: customer.totalRewardPoints,
        totalRedeemedRewardPoints: customer.totalRedeemedRewardPoints
    }).where({ ID: customer_ID });

    return next();
}