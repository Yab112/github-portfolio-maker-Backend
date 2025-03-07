export const generateOTP = (length = 6) => {
    const digits = '0123456789';
    return Array.from({ length }, () => 
      digits[Math.floor(Math.random() * digits.length)]
    ).join('');
  };