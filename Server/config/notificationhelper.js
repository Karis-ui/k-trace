import Notification from '../models/Notification';

export const createNotification = async (data) => {
    const notification = new Notification(data);
    await notification.save();
    return notification;
};

export const notifyPayoutCreated = async (farmerId, payout) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'payout',
        title: 'Payout Created',
        message: `A payout of $${payout.amount.toFixed(2)} has been created for your grading.`,
        icon: '💰',
        referenceId: payout._id,
        referenceModel: 'Payouts',
        link: '/farmer/payouts',
        priority: 'high'
    });
};

export const notifyPayoutApproved = async (farmerId, payout) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'payout',
        title: 'Payout Approved',
        message: `Your payout of $${payout.amount.toFixed(2)} has been approved.`,
        icon: '✅',
        referenceId: payout._id,
        referenceModel: 'Payouts',
        link: '/farmer/payouts',
        priority: 'high'
    });
};

export const notifyPayoutProcessed = async (farmerId, payout) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'payout',
        title: 'Payout Processed',
        message: `Your payout of $${payout.amount.toFixed(2)} has been processed. TXN: ${payout.transactionId}`,
        icon: '💳',
        referenceId: payout._id,
        referenceModel: 'Payouts',
        link: '/farmer/payouts',
        priority: 'high'
    });
};

export const notifyGradingRecorded = async (farmerId, grading) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'grading',
        title: 'Coffee Graded',
        message: `Your coffee has been graded as ${grading.grade} with a score of ${grading.cuppingScore}.`,
        icon: '⭐',
        referenceId: grading._id,
        referenceModel: 'Grading',
        link: '/farmer/gradings',
        priority: 'medium'
    });
};

export const notifyDeliveryRecorded = async (farmerId, delivery) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'delivery',
        title: 'Delivery Recorded',
        message: `Your delivery of ${delivery.weight}kg has been recorded successfully.`,
        icon: '📦',
        referenceId: delivery._id,
        referenceModel: 'Delivery',
        link: '/farmer/deliveries',
        priority: 'medium'
    });
};

export const notifyPriceUpdate = async (farmerIds, price) => {
    const notifications = [];
    for (const farmerId of farmerIds) {
        notifications.push(await createNotification({
            userId: farmerId,
            userModel: 'Farmer',
            userRole: 'farmer',
            type: 'price',
            title: 'Price Update',
            message: `New coffee price: $${price.amount.toFixed(2)} per kg for ${price.grade || 'all'} grade.`,
            icon: '📈',
            referenceId: price._id,
            referenceModel: 'Price',
            link: '/farmer/dashboard',
            priority: 'medium'
        }));
    }
    return notifications;
};

export const notifyOrderPlaced = async (buyerId, order) => {
    return await createNotification({
        userId: buyerId,
        userModel: 'Buyer',
        userRole: 'buyer',
        type: 'order',
        title: 'Order Placed',
        message: `Your order of ${order.quantity}kg has been placed successfully.`,
        icon: '🛒',
        referenceId: order._id,
        referenceModel: 'Orders',
        link: '/buyer/orders',
        priority: 'medium'
    });
};

export const notifyOrderShipped = async (buyerId, order) => {
    return await createNotification({
        userId: buyerId,
        userModel: 'Buyer',
        userRole: 'buyer',
        type: 'order',
        title: 'Order Shipped',
        message: `Your order #${order._id.slice(-6)} has been shipped.`,
        icon: '🚚',
        referenceId: order._id,
        referenceModel: 'Orders',
        link: '/buyer/orders',
        priority: 'high'
    });
};

export const notifyFermentationStarted = async (farmerId, fermentation) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'fermentation',
        title: 'Fermentation Started',
        message: `Fermentation started for your batch in tank ${fermentation.tankNumber}.`,
        icon: '🧪',
        referenceId: fermentation._id,
        referenceModel: 'Fermentation',
        link: '/farmer/dashboard',
        priority: 'medium'
    });
};

export const notifyFermentationCompleted = async (farmerId, fermentation) => {
    return await createNotification({
        userId: farmerId,
        userModel: 'Farmer',
        userRole: 'farmer',
        type: 'fermentation',
        title: 'Fermentation Completed',
        message: `Fermentation completed for your batch in tank ${fermentation.tankNumber}.`,
        icon: '✅',
        referenceId: fermentation._id,
        referenceModel: 'Fermentation',
        link: '/farmer/dashboard',
        priority: 'medium'
    });
};

export const notifySystemUpdate = async (userIds, message) => {
    const notifications = [];
    for (const userId of userIds) {
        notifications.push(await createNotification({
            userId,
            userModel: 'User',
            userRole: 'user',
            type: 'system',
            title: 'System Update',
            message: message,
            icon: '⚙️',
            link: '#',
            priority: 'low'
        }));
    }
    return notifications;
};

export const notifyAdminPayoutPending = async (adminId, payout) => {
    return await createNotification({
        userId: adminId,
        userModel: 'Admin',
        userRole: 'admin',
        type: 'payout',
        title: 'Payout Pending Approval',
        message: `Payout of $${payout.amount.toFixed(2)} for ${payout.farmerId?.name || 'farmer'} needs approval.`,
        icon: '🔔',
        referenceId: payout._id,
        referenceModel: 'Payouts',
        link: '/admin/payouts',
        priority: 'high'
    });
};

export const notifyFinancePayoutPending = async (financeOperatorId, payout) => {
    return await createNotification({
        userId: financeOperatorId,
        userModel: 'Operator',
        userRole: 'finance',
        type: 'payout',
        title: 'New Payout to Process',
        message: `Payout of $${payout.amount.toFixed(2)} is pending your action.`,
        icon: '💰',
        referenceId: payout._id,
        referenceModel: 'Payouts',
        link: '/finance/payouts',
        priority: 'high'
    });
};