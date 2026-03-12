import mongoose from "mongoose";

// 1. Khai báo biến global để giữ kết nối không bị đóng mở liên tục trên Vercel
let isConnected = false; 

const connectDB = async () => {
    // 2. Nếu đã có kết nối từ request trước, tái sử dụng luôn cho nhanh
    if (isConnected) {
        console.log("=> Đang dùng lại kết nối MongoDB có sẵn");
        return;
    }

    try {
        console.log("=> Đang thiết lập kết nối MongoDB mới...");
        
        // 3. Kết nối với tuỳ chọn tối ưu cho Serverless
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`, {
            serverSelectionTimeoutMS: 5000, // Đợi tối đa 5s, nếu không được thì báo lỗi ngay thay vì treo 10s
        });

        // 4. Lưu lại trạng thái kết nối
        isConnected = db.connections[0].readyState === 1;
        console.log("✅ Database connected successfully!");

    } catch (error) {
        console.error("❌ Lỗi kết nối MongoDB:", error.message);
        // 5. Rất quan trọng: Phải ném lỗi ra ngoài để ngắt hoàn toàn API, tránh lỗi dây chuyền
        throw new Error("Không thể kết nối Database"); 
    }
}

export default connectDB;