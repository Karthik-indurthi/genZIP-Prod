export const openRazorpay = (amount: number, description: string, onSuccess: () => void) => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  
  if (!razorpayKey) {
    console.error('Razorpay key is missing! Check your environment variables.');
    alert('Payment system configuration error. Please contact support.');
    return;
  }
    const options: any = {
      
      key: razorpayKey,
      amount: amount * 100, // in paisa
      currency: "INR",
      name: "Gen-ZIP",
      description,
      handler: function (response: any) {
        console.log(response);  // Can also call API to verify payment
        onSuccess();
      },
      prefill: {
        email: localStorage.getItem("clientEmail") || "",
      },
      theme: { color: "#3399cc" }
      
    };
    
  
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };
  