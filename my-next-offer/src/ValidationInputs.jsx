import React from "react";

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

// Input component that only accepts numbers
export function StrictNumberInput({
  value,
  onChange,
  placeholder = "Enter numbers only",
  maxLength,
  className = "custom-input",
  required = false,
  id,
  name
}) {
  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End"
    ];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "");

    if (maxLength && numbersOnly.length > maxLength) {
      onChange(numbersOnly.slice(0, maxLength));
    } else {
      onChange(numbersOnly);
    }
  };

  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      required={required}
      autoComplete="off"
    />
  );
}

// Input component for email validation
export function StrictEmailInput({
  value,
  onChange,
  placeholder = "name@example.com",
  className = "custom-input",
  required = false,
  id,
  name,
  showStatus = true
}) {
  const isFilled = value.trim().length > 0;
  const valid = isValidEmail(value);

  const handleChange = (e) => {
    onChange(e.target.value.replace(/\s/g, ""));
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        id={id}
        name={name}
        type="email"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${
          isFilled ? (valid ? "valid" : "invalid") : ""
        }`}
        required={required}
        autoComplete="email"
      />

      {showStatus && isFilled && (
        <span
          className={`field-validation-msg ${
            valid ? "success" : "error"
          }`}
          style={{ display: "block", marginTop: "4px" }}
        >
          {valid
            ? "✓ Valid email format"
            : "⚠ Please enter a valid email address (e.g. name@domain.com)"}
        </span>
      )}
    </div>
  );
}