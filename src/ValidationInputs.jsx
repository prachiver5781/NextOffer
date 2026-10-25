// Form Validation Inputs & Reusable Components - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. Reusable input components (StrictEmailInput, StrictNumberInput, StrictUrlInput)
// 2. Form validation strategies (Regex matching, live user feedback, input sanitization)

import React from "react";

// Standard email regex pattern
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper function to check if email format is valid
export function isValidEmail(email) {
  if (!email) return false;
  return EMAIL_REGEX.test(email.trim());
}

// Helper function to check if a generic web URL is valid
export function isValidUrl(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  // Allow URLs with or without http(s)://
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  return urlPattern.test(trimmed);
}

// Platform-specific link rules for student developer profiles
export const PLATFORM_RULES = {
  github: {
    name: "GitHub",
    icon: "🐙",
    placeholder: "https://github.com/username or username",
    hint: "Must be a valid GitHub profile (e.g. github.com/ruhani)",
    validate: (val) => {
      if (!val) return true; // empty is handled by required flag
      const clean = val.trim();
      // Allow full URL or just username handle
      return (
        /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/i.test(clean) ||
        /^[a-zA-Z0-9_-]{1,39}$/.test(clean)
      );
    },
    normalize: (val) => {
      if (!val) return "";
      const clean = val.trim();
      if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
      if (clean.includes("github.com/")) return `https://${clean}`;
      return `https://github.com/${clean}`;
    }
  },
  linkedin: {
    name: "LinkedIn",
    icon: "💼",
    placeholder: "https://linkedin.com/in/username",
    hint: "Must be a valid LinkedIn profile URL (e.g. linkedin.com/in/ruhani)",
    validate: (val) => {
      if (!val) return true;
      const clean = val.trim();
      return (
        /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/i.test(clean) ||
        /^[a-zA-Z0-9_-]{3,100}$/.test(clean)
      );
    },
    normalize: (val) => {
      if (!val) return "";
      const clean = val.trim();
      if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
      if (clean.includes("linkedin.com/")) return `https://${clean}`;
      return `https://linkedin.com/in/${clean}`;
    }
  },
  leetcode: {
    name: "LeetCode",
    icon: "⚡",
    placeholder: "https://leetcode.com/u/username or username",
    hint: "Must be a valid LeetCode profile (e.g. leetcode.com/u/ruhani)",
    validate: (val) => {
      if (!val) return true;
      const clean = val.trim();
      return (
        /^(https?:\/\/)?(www\.)?leetcode\.com\/(u\/)?[a-zA-Z0-9_-]+\/?$/i.test(clean) ||
        /^[a-zA-Z0-9_-]{2,30}$/.test(clean)
      );
    },
    normalize: (val) => {
      if (!val) return "";
      const clean = val.trim();
      if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
      if (clean.includes("leetcode.com/")) return `https://${clean}`;
      return `https://leetcode.com/u/${clean}`;
    }
  },
  hackerrank: {
    name: "HackerRank",
    icon: "🟩",
    placeholder: "https://hackerrank.com/profile/username",
    hint: "Must be a valid HackerRank handle or URL",
    validate: (val) => {
      if (!val) return true;
      const clean = val.trim();
      return (
        /^(https?:\/\/)?(www\.)?hackerrank\.com\/(profile\/)?[a-zA-Z0-9_.-]+\/?$/i.test(clean) ||
        /^[a-zA-Z0-9_.-]{2,30}$/.test(clean)
      );
    },
    normalize: (val) => {
      if (!val) return "";
      const clean = val.trim();
      if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
      if (clean.includes("hackerrank.com/")) return `https://${clean}`;
      return `https://hackerrank.com/profile/${clean}`;
    }
  },
  portfolio: {
    name: "Portfolio",
    icon: "🌐",
    placeholder: "https://yourportfolio.dev",
    hint: "Must be a valid website URL (e.g. https://ruhani.dev)",
    validate: (val) => {
      if (!val) return true;
      return isValidUrl(val);
    },
    normalize: (val) => {
      if (!val) return "";
      const clean = val.trim();
      if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
      return `https://${clean}`;
    }
  }
};

// Validate individual platform link
export function validatePlatformLink(platform, value) {
  if (!value || !value.trim()) return { isValid: true, message: "" };
  const rule = PLATFORM_RULES[platform];
  if (!rule) {
    const valid = isValidUrl(value);
    return {
      isValid: valid,
      message: valid ? "Valid URL" : "Please enter a valid URL."
    };
  }

  const isValid = rule.validate(value);
  return {
    isValid,
    message: isValid ? `Valid ${rule.name} link` : rule.hint
  };
}

// 1. StrictNumberInput: Allows only digit keys (0-9)
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
    const onlyDigits = e.target.value.replace(/\D/g, "");
    if (maxLength && onlyDigits.length > maxLength) {
      onChange(onlyDigits.slice(0, maxLength));
    } else {
      onChange(onlyDigits);
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

// 2. StrictEmailInput: Reusable component that tests standard email regex
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
  const isFilled = (value || "").trim().length > 0;
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
        className={`${className} ${isFilled ? (valid ? "valid" : "invalid") : ""}`}
        required={required}
        autoComplete="email"
      />
      {showStatus && isFilled && (
        <span
          className={`field-validation-msg ${valid ? "success" : "error"}`}
          style={{ display: "block", marginTop: "4px" }}
        >
          {valid ? "✓ Valid email format" : "⚠ Please enter a valid email address (e.g. student@college.edu)"}
        </span>
      )}
    </div>
  );
}

// 3. StrictUrlInput: Reusable component for GitHub, LinkedIn, LeetCode, HackerRank, and Portfolio URLs
export function StrictUrlInput({
  platform = "portfolio",
  value = "",
  onChange,
  required = false,
  id,
  name,
  showValidation = true
}) {
  const rule = PLATFORM_RULES[platform] || PLATFORM_RULES.portfolio;
  const isFilled = (value || "").trim().length > 0;
  const { isValid, message } = validatePlatformLink(platform, value);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="strict-url-wrapper" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "var(--bg-input)",
          border: `1px solid ${
            isFilled
              ? isValid
                ? "rgba(16, 185, 129, 0.6)"
                : "rgba(239, 68, 68, 0.7)"
              : "var(--border-main)"
          }`,
          borderRadius: "var(--radius-sm)",
          padding: "2px 8px",
          transition: "var(--transition)"
        }}
      >
        <span
          style={{
            fontSize: "16px",
            marginRight: "8px",
            userSelect: "none",
            display: "inline-flex",
            alignItems: "center"
          }}
          title={rule.name}
        >
          {rule.icon}
        </span>
        <input
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={rule.placeholder}
          required={required}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-main)",
            fontSize: "13.5px",
            width: "100%",
            padding: "8px 0"
          }}
          autoComplete="off"
        />
        {isFilled && (
          <span
            style={{
              fontSize: "14px",
              marginLeft: "6px",
              color: isValid ? "#34d399" : "#f87171"
            }}
          >
            {isValid ? "✓" : "⚠"}
          </span>
        )}
      </div>

      {showValidation && isFilled && (
        <span
          className={`field-validation-msg ${isValid ? "success" : "error"}`}
          style={{ display: "block", marginTop: "4px", fontSize: "11.5px" }}
        >
          {isValid ? `✓ ${message}` : `⚠ ${message}`}
        </span>
      )}
    </div>
  );
}
