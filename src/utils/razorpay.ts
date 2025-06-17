export const openRazorpay = (amount: number, description: string, onSuccess: () => void) => {
    const options: any = {
      
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
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
  