import tkinter as tk
from tkinter import messagebox

def calculate_emi():
    try:
        principal = float(principal_entry.get())
        rate = float(rate_entry.get()) / 100 / 12 
        tenure = int(tenure_entry.get())
        if principal <= 0 or rate <= 0 or tenure <= 0:
            raise ValueError("Inputs must be positive numbers")
        emi = (principal * rate * (1 + rate) ** tenure) / ((1 + rate) ** tenure - 1)
        result_label.config(text=f"EMI: ₹{emi:,.2f}")
    except ValueError as e:
        messagebox.showerror("Error", "Please enter valid numbers")


root = tk.Tk()
root.title("EMI Calculator")
root.geometry("300x250")

tk.Label(root, text="Principal (₹):").pack(pady=5)
principal_entry = tk.Entry(root)
principal_entry.pack()

tk.Label(root, text="Annual Interest Rate (%):").pack(pady=5)
rate_entry = tk.Entry(root)
rate_entry.pack()

tk.Label(root, text="Tenure (Months):").pack(pady=5)
tenure_entry = tk.Entry(root)
tenure_entry.pack()


tk.Button(root, text="Calculate EMI", command=calculate_emi).pack(pady=10)


result_label = tk.Label(root, text="EMI: ₹0.00")
result_label.pack(pady=10)

root.mainloop()