import tkinter as tk
from tkinter import messagebox

def calculate_sip():
    try:
        # Get inputs
        sip_amount = float(sip_amount_entry.get())
        tenure = float(tenure_entry.get())
        annual_rate = float(rate_entry.get()) / 100 / 12  # Monthly rate
        tenure_type = tenure_var.get()

        # Convert tenure to months
        if tenure_type == "Years":
            months = int(tenure * 12)
        else:
            months = int(tenure)

        # Validate inputs
        if sip_amount <= 0 or months <= 0 or annual_rate < 0:
            raise ValueError("SIP amount, tenure, and rate must be positive")
        if annual_rate > 0.05:  # Assume max 60% annual return for realism
            raise ValueError("Annual return rate seems too high")

        # Calculate future value
        future_value = sip_amount * (((1 + annual_rate) ** months - 1) / annual_rate) * (1 + annual_rate)
        invested_amount = sip_amount * months
        wealth_gained = future_value - invested_amount

        # Update result labels
        future_value_label.config(text=f"Future Value: ₹{future_value:,.2f}")
        invested_amount_label.config(text=f"Invested Amount: ₹{invested_amount:,.2f}")
        wealth_gained_label.config(text=f"Wealth Gained: ₹{wealth_gained:,.2f}")
    except ValueError as e:
        messagebox.showerror("Error", str(e) or "Please enter valid numbers")

# Create main window
root = tk.Tk()
root.title("SIP Calculator")
root.geometry("400x400")

# Input fields
tk.Label(root, text="Monthly SIP Amount (₹):", font=("Arial", 12)).pack(pady=5)
sip_amount_entry = tk.Entry(root, font=("Arial", 12))
sip_amount_entry.pack()

tk.Label(root, text="Tenure:", font=("Arial", 12)).pack(pady=5)
tenure_entry = tk.Entry(root, font=("Arial", 12))
tenure_entry.pack()

# Tenure type selection
tenure_var = tk.StringVar(value="Years")
tk.Radiobutton(root, text="Years", variable=tenure_var, value="Years", font=("Arial", 10)).pack()
tk.Radiobutton(root, text="Months", variable=tenure_var, value="Months", font=("Arial", 10)).pack()

tk.Label(root, text="Expected Annual Return (%):", font=("Arial", 12)).pack(pady=5)
rate_entry = tk.Entry(root, font=("Arial", 12))
rate_entry.pack()

# Calculate button
tk.Button(root, text="Calculate SIP", command=calculate_sip, font=("Arial", 12)).pack(pady=10)

# Output frame
output_frame = tk.Frame(root)
output_frame.pack(pady=10)

# Result labels
future_value_label = tk.Label(output_frame, text="Future Value: ₹0.00", font=("Arial", 12))
future_value_label.pack(pady=5)
invested_amount_label = tk.Label(output_frame, text="Invested Amount: ₹0.00", font=("Arial", 12))
invested_amount_label.pack(pady=5)
wealth_gained_label = tk.Label(output_frame, text="Wealth Gained: ₹0.00", font=("Arial", 12))
wealth_gained_label.pack(pady=5)

# Start the main loop
root.mainloop()