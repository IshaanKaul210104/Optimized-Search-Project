import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  return (
    <div className="checkout-popup">
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Your Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="checkout-items">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item" style={{ display: "flex", marginBottom: "15px" }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginRight: "15px",
                  }}
                />
                <div style={{ flex: "1" }}>
                  <p style={{ fontWeight: "bold", marginBottom: "5px" }}>{item.name}</p>
                  <p style={{ margin: "0", fontSize: "0.9rem" }}>Quantity: {item.quantity}</p>
                  <p style={{ margin: "0", fontSize: "0.9rem" }}>Subtotal: ${item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Total: ${totalPrice}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCheckout}>
            Confirm Purchase
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CheckoutPopup;
