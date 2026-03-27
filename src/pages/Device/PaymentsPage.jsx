import React from "react";
import "./PaymentsPage.css";

const PaymentsPage = () => {
  const rows = [
    { id: "#TXN1023", date: "26 Mar", amount: "₹ 649", status: "Success" },
    { id: "#TXN1018", date: "01 Mar", amount: "₹ 649", status: "Success" },
    { id: "#TXN1007", date: "01 Feb", amount: "₹ 649", status: "Failed" },
  ];

  return (
    <div className="pay-page">
      <h2 className="pay-title">Payments</h2>
      <p className="pay-subtitle">
        View your past bills and payment status for this purifier.
      </p>

      <div className="pay-list">
        {rows.map((row) => (
          <div key={row.id} className="pay-row">
            <div>
              <div className="pay-id">{row.id}</div>
              <div className="pay-date">{row.date}</div>
            </div>
            <div className="pay-right">
              <div className="pay-amount">{row.amount}</div>
              <span
                className={
                  "pay-pill " +
                  (row.status === "Success"
                    ? "pay-pill-success"
                    : "pay-pill-failed")
                }
              >
                {row.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsPage;
