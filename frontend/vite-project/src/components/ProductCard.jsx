import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProductPage() {
    return (
        <div className="p-4">
        {/* Header Line */}
        <Typography variant="h1" className="text-center mb-8 text-white">
            Razorpay Payment Integration BY Marri Karunya Reddy
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
            <ProductCard
                title="T-SHIRT"
                price={799}
                originalPrice={1599}
                imageUrl="https://images.asos-media.com/products/ps-paul-smith-t-shirt-with-zebra-cards-print-in-light-blue/206650345-1-lightblue?$n_750w$&wid=750&fit=constrain"
            />

            <ProductCard
                title="CAP"
                price={549}
                originalPrice={1099}
                imageUrl="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRWKbkahBGQLb9eVyHwDPPUaUqA_DcrxpUbcezbqHUfnBpyhLmBxLBINmZzp4A8n66oN2AdKa9dPN0x1i6FnpZwShxfYjx4C_P4XwgdzCQr_6qx6umCk29V&usqp=CAE"
            />
            <ProductCard
                title="JACKET"
                price={1899}
                originalPrice={3799}
                imageUrl="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT_LU4_mfbhWlXrkWO_oYMSzx6Rf4QNE77dnn9Bgz4Gs5KkqSSm53J9fvndifLmDO3nXR9CvgONjj5FlUUUdfl4c_pd1fD_v3Y0QAdsdBUwO5v8P4YXanUUJw&usqp=CAE"
            />
            <ProductCard
                title="SHOES"
                price={7999}
                originalPrice={15999}
                imageUrl="https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRaqiuIepRM9bm8zJgZa9Y8rGRyLJzzrPTEdmPjV-Ukv1-LXAGg7sGFoNuMKoXPOSfoNdJinzknwC4OoRWEimgYnBVggQxfZmkwdLGGHVMvdtEVFlTgxzDC&usqp=CAE"
            />
            <ProductCard
                title="WATCH"
                price={12999}
                originalPrice={17599}
                imageUrl="https://fossil.scene7.com/is/image/FossilPartners/JR1401_main?$sfcc_fos_large$"
            />
            
            
            </div>
            
        </div>
    );
}

function ProductCard({ title, price, originalPrice, imageUrl }) {
    const [amount, setAmount] = useState(price);

    const handlePayment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/order`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    amount
                })
            });

            const data = await res.json();
            console.log(data);
            handlePaymentVerify(data.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handlePaymentVerify = async (data) => {
        const options = {
            key: import.meta.env.RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Marri Karunya Reddy",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response) => {
                console.log("response", response)
                try {
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData = await res.json();

                    if (verifyData.message) {
                        toast.success(verifyData.message)
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

    return (
        <Card className="bg-[#222f3e] text-white">
            <CardHeader className="relative h-64 bg-[#2C3A47]">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </CardHeader>
            <CardBody>
                <Typography variant="h5" className="mb-2">
                    {title}
                </Typography>
                <Typography>
                    ₹{price} <span className="line-through">₹{originalPrice}</span> 50% OFF
                </Typography>
            </CardBody>
            <CardFooter className="pt-0">
                <Button onClick={handlePayment} className="w-full bg-[#1B9CFC]">Buy Now</Button>
                <Toaster/>
            </CardFooter>
        </Card>
    );
}
