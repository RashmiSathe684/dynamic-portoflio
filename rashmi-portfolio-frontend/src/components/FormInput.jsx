import React from 'react';

export default function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  textarea = false,
  rows = 4,
  ...props
}) {
  const inputClasses = `w-full px-4 py-3 rounded-xl border transition-all duration-300 bg-brand-bg/50 text-text-main focus:outline-none focus:ring-2 focus:ring-accent/40 ${
    error 
      ? 'border-coral focus:border-coral' 
      : 'border-brand-border focus:border-accent'
  }`;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-semibold text-text-main/80 select-none"
        >
          {label} {required && <span className="text-coral" aria-hidden="true">*</span>}
        </label>
      )}
      
      {textarea ? (
        <textarea
          id={id}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
      )}
      
      {error && (
        <p 
          id={`${id}-error`} 
          className="text-xs text-coral font-medium mt-1 animate-pulse"
          role="alert"
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
