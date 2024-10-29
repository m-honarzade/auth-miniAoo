"use server";
export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  let errors = {};
  if (!email.includes("@")) {
    errors.email = "please enter a valid email address.";
  }
  if (password.trim().length < 8) {
    errors.email = "please enter a valid password with at least 8 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors: errors };
  }
}
