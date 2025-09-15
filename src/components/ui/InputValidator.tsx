'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Validation rules
interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
  severity: 'error' | 'warning';
}

interface InputValidatorProps {
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  validationRules?: ValidationRule[];
  showValidation?: boolean;
  autoComplete?: string;
}

// Common validation rules
const commonRules = {
  required: (message = 'Este campo é obrigatório'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message,
    severity: 'error'
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value.length >= min,
    message: message || `Mínimo de ${min} caracteres`,
    severity: 'error'
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => value.length <= max,
    message: message || `Máximo de ${max} caracteres`,
    severity: 'error'
  }),
  
  email: (message = 'Email inválido'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
    severity: 'error'
  }),
  
  password: (message = 'Senha deve ter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula e 1 número'): ValidationRule => ({
    test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value),
    message,
    severity: 'error'
  }),
  
  noSpecialChars: (message = 'Caracteres especiais não são permitidos'): ValidationRule => ({
    test: (value) => /^[a-zA-Z0-9\s]*$/.test(value),
    message,
    severity: 'warning'
  }),
  
  noSqlInjection: (message = 'Caracteres suspeitos detectados'): ValidationRule => ({
    test: (value) => !/('|(\-\-)|(;)|(\|)|(\*)|(%))/i.test(value),
    message,
    severity: 'error'
  }),
  
  noXss: (message = 'Conteúdo HTML não é permitido'): ValidationRule => ({
    test: (value) => !/<[^>]*>/g.test(value),
    message,
    severity: 'error'
  })
};

// Sanitize input to prevent XSS
const sanitizeInput = (value: string): string => {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const InputValidator: React.FC<InputValidatorProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  className = '',
  validationRules = [],
  showValidation = true,
  autoComplete
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  // Get default validation rules based on type
  const getDefaultRules = useCallback((): ValidationRule[] => {
    const rules: ValidationRule[] = [];
    
    if (required) {
      rules.push(commonRules.required());
    }
    
    // Always add security rules
    rules.push(commonRules.noSqlInjection());
    rules.push(commonRules.noXss());
    
    switch (type) {
      case 'email':
        rules.push(commonRules.email());
        break;
      case 'password':
        rules.push(commonRules.minLength(8));
        rules.push(commonRules.password());
        break;
      case 'text':
        rules.push(commonRules.maxLength(255));
        break;
      case 'number':
        // Add number-specific validation if needed
        break;
    }
    
    return rules;
  }, [type, required]);

  // Memoize all rules to prevent recreation
  const allRules = useMemo(() => [...getDefaultRules(), ...validationRules], [getDefaultRules, validationRules]);

  // Validate input
  const validateInput = useCallback((inputValue: string) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    allRules.forEach(rule => {
      if (!rule.test(inputValue)) {
        if (rule.severity === 'error') {
          errors.push(rule.message);
        } else {
          warnings.push(rule.message);
        }
      }
    });
    
    return { errors, warnings, isValid: errors.length === 0 };
  }, [allRules]);

  const validation = validateInput(value);
  const shouldShowValidation = showValidation && hasBeenTouched && value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeInput(rawValue);
    onChange(sanitizedValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBeenTouched(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            bg-gray-800/50 backdrop-blur-xl text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed
            ${validation.isValid || !shouldShowValidation
              ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
              : 'border-red-500 focus:border-red-400 focus:ring-red-500/20'
            }
            ${isFocused ? 'shadow-lg' : ''}
          `}
        />
        
        {/* Password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {/* Validation status icon */}
        {shouldShowValidation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {validation.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
          </div>
        )}
      </div>
      
      {/* Validation messages */}
      <AnimatePresence>
        {shouldShowValidation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {validation.errors.map((error, index) => (
              <motion.div
                key={`error-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-sm text-red-400"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            ))}
            
            {validation.warnings.map((warning, index) => (
              <motion.div
                key={`warning-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 text-sm text-yellow-400"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{warning}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export validation rules for external use
export { commonRules, sanitizeInput };
export type { ValidationRule };

export default InputValidator;