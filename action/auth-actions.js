"use server";

import { createAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  let errors = {};
  if (!email.includes("@")) {
    errors.email = "please enter a valid email address.";
  }
  if (password.trim().length < 8) {
    errors.password =
      "please enter a valid password with at least 8 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors: errors };
  }
  const hashedPassword = hashUserPassword(password);
  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "It seems like an account for the chosen email already exist.",
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const existingUser = getUserByEmail(email);
  if (!existingUser) {
    return {
      errors: {
        email: "Could not authenticate email, please check the credentials.",
      },
    };
  }
  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        password:
          "Could not authenticate password, please check the credentials.",
      },
    };
  }
  await createAuthSession(existingUser.id);
  redirect("/training");
}
