-- CreateTable
CREATE TABLE "RazorpayPayment" (
    "id" TEXT NOT NULL,
    "razorpayPaymentId" TEXT NOT NULL,
    "razorpayOrderId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerContact" TEXT,
    "method" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rawEvent" JSONB,

    CONSTRAINT "RazorpayPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RazorpayPayment_razorpayPaymentId_key" ON "RazorpayPayment"("razorpayPaymentId");

-- CreateIndex
CREATE INDEX "RazorpayPayment_razorpayOrderId_idx" ON "RazorpayPayment"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "RazorpayPayment_createdAt_idx" ON "RazorpayPayment"("createdAt");
