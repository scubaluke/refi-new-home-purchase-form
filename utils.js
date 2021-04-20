// Validate supplied email address with regex
export function emailIsValid(email) {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
    email
  );
}

export function simplifyPhone(number) {
  return number.replace(/\D/g, '');
}

export async function validatePhoneNumber(phoneNum) {
  const endpoint = 'https://refitextverification.herokuapp.com/lookup/?phone=';
  let validated = {};
  try {
    const result = await fetch(`${endpoint}${phoneNum}`)
      .then((resp) => resp.json())
      .then((data) => {
        if (data.phoneNumber) {
          validated.phoneNumber = data.phoneNumber.slice(-10);
        }
      });
  } catch (error) {
    console.error(`Error validating phone number: ${error}`);
  }
  return validated;
}
