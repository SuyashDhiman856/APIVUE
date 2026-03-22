export const validateEmail = (email: string) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!re.test(email)) return false;
  
  // Check for common providers or company domains
  // This is a simple check, in reality we might check against a list of burner domains
  const domain = email.split('@')[1].toLowerCase();
  const commonProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com', 'zoho.com'];
  
  // If it's a common provider or has at least one dot in the domain (standard company email)
  return commonProviders.includes(domain) || domain.includes('.');
};
