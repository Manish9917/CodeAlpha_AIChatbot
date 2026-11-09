"use strict";

/* =========================================
   CONFIGURATION
========================================= */

const API_BASE_URL = "http://localhost:8080";
const API_URL = `${API_BASE_URL}/api/chat`;

const TOKEN_KEY = "chatbot_token";
const USER_KEY = "chatbot_user";
const THEME_KEY = "chatbot-theme";

/* =========================================
   DOM ELEMENTS
========================================= */

// Authentication
const authScreen = document.getElementById("authScreen");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");

const authMessage = document.getElementById("authMessage");
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const registerFullName = document.getElementById("registerFullName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword = document.getElementById(
  "registerConfirmPassword",
);

// Application
const appContainer = document.getElementById("appContainer");

const currentUserName = document.getElementById("currentUserName");
const currentUserEmail = document.getElementById("currentUserEmail");
const userAvatar = document.getElementById("userAvatar");
const logoutBtn = document.getElementById("logoutBtn");

// Theme
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

// Chat
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const welcomeScreen = document.getElementById("welcomeScreen");

const conversationList = document.getElementById("conversationList");
const conversationCount = document.getElementById("conversationCount");
const historyEmpty = document.getElementById("historyEmpty");

const mobileHistoryBtn = document.getElementById("mobileHistoryBtn");
const closeMobileSidebarBtn = document.getElementById("closeMobileSidebarBtn");
const toastContainer = document.getElementById("toastContainer");
const characterCount = document.getElementById("characterCount");

/* =========================================
   APPLICATION STATE
========================================= */

let isWaitingForResponse = false;
let currentConversationId = null;
let currentUser = null;
let toastIdCounter = 0;

/* =========================================
   API HELPERS
========================================= */

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const data = await readResponse(response);

  if (response.status === 401) {
    handleSessionExpired();
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "The request could not be completed.",
    );
  }

  return data;
}

/* =========================================
   AUTHENTICATION MESSAGES
========================================= */

function showAuthMessage(message, type = "error") {
  authMessage.textContent = message;
  authMessage.className = `auth-message ${type}`;
}

function clearAuthMessage() {
  authMessage.textContent = "";
  authMessage.className = "auth-message";
}

function setAuthLoading(button, isLoading, normalText) {
  button.disabled = isLoading;
  button.textContent = isLoading ? "Please wait..." : normalText;
}

function showLoginScreen() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  clearAuthMessage();
}

function showRegisterScreen() {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  clearAuthMessage();
}

/* =========================================
   USER REGISTRATION
========================================= */

showRegisterBtn.addEventListener("click", showRegisterScreen);

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearAuthMessage();

  const fullName = registerFullName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const confirmPassword = registerConfirmPassword.value;

  if (password !== confirmPassword) {
    showAuthMessage("Passwords do not match.");
    return;
  }

  if (password.length < 8) {
    showAuthMessage("Password must contain at least 8 characters.");
    return;
  }

  setAuthLoading(registerBtn, true, "Create Account");

  try {
    const data = await apiRequest(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify({
        fullName,
        email,
        password,
      }),
    });

    showAuthMessage(
      data.message || "Account created successfully. Please sign in.",
      "success",
    );

    registerForm.reset();

    window.setTimeout(() => {
      showLoginScreen();
      loginEmail.value = email;
      loginPassword.focus();
    }, 1200);
  } catch (error) {
    showAuthMessage(error.message);
  } finally {
    setAuthLoading(registerBtn, false, "Create Account");
  }
});

/* =========================================
   USER LOGIN
========================================= */

showLoginBtn.addEventListener("click", showLoginScreen);

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearAuthMessage();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  setAuthLoading(loginBtn, true, "Sign In");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        data.message || data.error || "Invalid email or password.",
      );
    }

    if (!data.token) {
      throw new Error("The server did not return an authentication token.");
    }

    const user = {
      userId: data.userId,
      fullName: data.fullName || email.split("@")[0],
      email: data.email || email,
    };

    sessionStorage.setItem(TOKEN_KEY, data.token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));

    currentUser = user;

    loginForm.reset();

    await openApplication();

    showToast("Welcome back!", "success");
  } catch (error) {
    showAuthMessage(error.message);
  } finally {
    setAuthLoading(loginBtn, false, "Sign In");
  }
});

/* =========================================
   APPLICATION ACCESS
========================================= */

function showApplication() {
  authScreen.classList.add("hidden");
  appContainer.classList.remove("hidden");
}

function showAuthentication() {
  appContainer.classList.add("hidden");
  authScreen.classList.remove("hidden");
  showLoginScreen();
}

function updateUserProfile(user) {
  currentUserName.textContent = user.fullName || "User";
  currentUserEmail.textContent = user.email || "";

  userAvatar.textContent = (user.fullName || "U")
    .trim()
    .charAt(0)
    .toUpperCase();
}

async function openApplication() {
  showApplication();

  updateUserProfile(currentUser);

  await initializeChat();

  messageInput.focus();
}

/* =========================================
   RESTORE EXISTING SESSION
========================================= */

async function restoreSession() {
  const token = getToken();

  if (!token) {
    showAuthentication();
    return;
  }

  try {
    const savedUser = sessionStorage.getItem(USER_KEY);

    currentUser = savedUser ? JSON.parse(savedUser) : null;

    if (!currentUser) {
      throw new Error("User session information is unavailable.");
    }

    await apiRequest(`${API_BASE_URL}/api/conversations`);

    await openApplication();
  } catch (error) {
    console.error("Session restoration failed:", error);

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    currentUser = null;
    showAuthentication();
  }
}

/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener("click", () => {
  if (isWaitingForResponse) {
    showToast("Please wait for the current response to finish.", "info");
    return;
  }

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  currentUser = null;
  currentConversationId = null;

  conversationList.replaceChildren();
  chatMessages.replaceChildren();

  loginForm.reset();
  registerForm.reset();

  showAuthentication();

  showToast("You have been logged out successfully.", "success");
});

/* =========================================
   SESSION EXPIRATION
========================================= */

function handleSessionExpired() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);

  currentUser = null;
  currentConversationId = null;

  showAuthentication();
}

/* =========================================
   THEME MANAGEMENT
========================================= */

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const isDark = theme === "dark";

  themeIcon.textContent = isDark ? "☀" : "☾";
  themeText.textContent = isDark ? "Light Mode" : "Dark Mode";

  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
}

const savedTheme = localStorage.getItem(THEME_KEY) || "dark";

applyTheme(savedTheme);

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem(THEME_KEY, newTheme);
});

/* =========================================
   TOAST NOTIFICATIONS
========================================= */

function showToast(message, type = "success", duration = 3000) {
  const toast = document.createElement("div");

  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  const icon = document.createElement("span");
  icon.className = "toast-icon";

  const icons = {
    success: "✓",
    error: "!",
    info: "i",
  };

  icon.textContent = icons[type] || icons.info;

  const text = document.createElement("span");
  text.className = "toast-message";
  text.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "toast-close";
  closeButton.setAttribute("aria-label", "Dismiss notification");
  closeButton.textContent = "×";

  function dismissToast() {
    if (!toast.isConnected) return;

    window.clearTimeout(timer);
    toast.classList.add("toast-hiding");

    window.setTimeout(() => toast.remove(), 300);
  }

  closeButton.addEventListener("click", dismissToast);

  toast.append(icon, text, closeButton);
  toastContainer.appendChild(toast);

  while (toastContainer.children.length > 4) {
    toastContainer.firstElementChild.remove();
  }

  const timer = window.setTimeout(dismissToast, duration);
}

/* =========================================
   CHAT MESSAGE DISPLAY
========================================= */

function addMessage(messageText, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  const avatar = document.createElement("div");
  avatar.classList.add("message-avatar");
  avatar.textContent = sender === "user" ? "YOU" : "AI";

  const content = document.createElement("div");
  content.classList.add("message-content");

  const name = document.createElement("div");
  name.classList.add("message-name");
  name.textContent = sender === "user" ? "YOU" : "AI Assistant";

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  if (sender === "assistant" && window.marked && window.DOMPurify) {
    const renderedMarkdown = window.marked.parse(messageText, {
      gfm: true,
      breaks: true,
    });

    bubble.innerHTML = window.DOMPurify.sanitize(renderedMarkdown);
  } else {
    bubble.textContent = messageText;
  }

  content.append(name, bubble);

  if (sender === "assistant") {
    const actions = document.createElement("div");
    actions.className = "message-actions";

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "copy-message-btn";
    copyButton.setAttribute("aria-label", "Copy AI response");
    copyButton.title = "Copy response";
    copyButton.textContent = "Copy";

    copyButton.addEventListener("click", async () => {
      try {
        await copyTextToClipboard(messageText);

        copyButton.textContent = "Copied!";
        copyButton.classList.add("copied");

        showToast("Response copied successfully.", "success");

        window.setTimeout(() => {
          if (copyButton.isConnected) {
            copyButton.textContent = "Copy";
            copyButton.classList.remove("copied");
          }
        }, 1800);
      } catch (error) {
        console.error("Copy failed:", error);
        showToast("Unable to copy the response.", "error");
      }
    });

    actions.appendChild(copyButton);
    content.appendChild(actions);
  }

  messageElement.append(avatar, content);
  chatMessages.appendChild(messageElement);

  scrollToBottom();

  return messageElement;
}

/* =========================================
   COPY TO CLIPBOARD
========================================= */

async function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporaryTextArea = document.createElement("textarea");

  temporaryTextArea.value = text;
  temporaryTextArea.setAttribute("readonly", "");
  temporaryTextArea.style.position = "fixed";
  temporaryTextArea.style.left = "-9999px";

  document.body.appendChild(temporaryTextArea);
  temporaryTextArea.select();

  try {
    const copied = document.execCommand("copy");

    if (!copied) {
      throw new Error("The browser could not copy the text.");
    }
  } finally {
    temporaryTextArea.remove();
  }
}

/* =========================================
   CHAT UTILITIES
========================================= */

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", "assistant");
  messageElement.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.classList.add("message-avatar");
  avatar.textContent = "AI";

  const content = document.createElement("div");
  content.classList.add("message-content");

  const name = document.createElement("div");
  name.classList.add("message-name");
  name.textContent = "AI Assistant is typing...";

  const indicator = document.createElement("div");
  indicator.classList.add("message-bubble", "typing-indicator");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("span");
    indicator.appendChild(dot);
  }

  content.append(name, indicator);
  messageElement.append(avatar, content);

  chatMessages.appendChild(messageElement);

  scrollToBottom();
}

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");

  if (indicator) {
    indicator.remove();
  }
}

function setLoading(isLoading) {
  isWaitingForResponse = isLoading;

  sendBtn.disabled = isLoading;
  messageInput.disabled = isLoading;

  sendBtn.setAttribute("aria-busy", String(isLoading));
}

/* =========================================
   SEND CHAT MESSAGE
========================================= */

async function sendMessage(message) {
  const trimmedMessage = message.trim();

  if (!trimmedMessage || isWaitingForResponse) {
    return;
  }

  if (!getToken()) {
    handleSessionExpired();
    return;
  }

  if (welcomeScreen && welcomeScreen.isConnected) {
    welcomeScreen.remove();
  }

  addMessage(trimmedMessage, "user");

  messageInput.value = "";
  messageInput.style.height = "auto";

  if (characterCount) {
    characterCount.textContent = "0";
  }

  setLoading(true);
  showTypingIndicator();

  try {
    const data = await apiRequest(API_URL, {
      method: "POST",
      body: JSON.stringify({
        conversationId: currentConversationId,
        message: trimmedMessage,
      }),
    });

    if (
      typeof data.conversationId !== "number" ||
      !Number.isFinite(data.conversationId)
    ) {
      throw new Error("The server returned an invalid conversation ID.");
    }

    currentConversationId = data.conversationId;

    if (typeof data.reply !== "string") {
      throw new Error("The server returned an unexpected response.");
    }

    addMessage(data.reply, "assistant");

    await loadConversations();
  } catch (error) {
    console.error("Chat request failed:", error);

    if (getToken()) {
      addMessage(
        error.message || "Unable to connect to the chatbot.",
        "assistant",
      );
    }
  } finally {
    removeTypingIndicator();
    setLoading(false);

    if (getToken()) {
      messageInput.focus();
    }
  }
}

/* =========================================
   CHAT FORM EVENTS
========================================= */

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

messageInput.addEventListener("input", () => {
  messageInput.style.height = "auto";

  messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + "px";

  if (characterCount) {
    characterCount.textContent = messageInput.value.length;
  }
});

/* =========================================
   SUGGESTION BUTTONS
========================================= */

document.querySelectorAll(".suggestion-card").forEach((button) => {
  button.addEventListener("click", () => {
    const suggestedMessage = button.dataset.message;

    if (suggestedMessage) {
      sendMessage(suggestedMessage);
    }
  });
});

/* =========================================
   NEW CHAT
========================================= */

newChatBtn.addEventListener("click", () => {
  if (isWaitingForResponse) {
    return;
  }

  currentConversationId = null;

  chatMessages.replaceChildren();

  if (welcomeScreen) {
    chatMessages.appendChild(welcomeScreen);
  }

  document.querySelectorAll(".conversation-item").forEach((button) => {
    button.classList.remove("active");
  });

  messageInput.value = "";
  messageInput.style.height = "auto";

  if (characterCount) {
    characterCount.textContent = "0";
  }

  messageInput.focus();
});

/* =========================================
   LOAD CONVERSATION HISTORY
========================================= */

async function loadConversations() {
  try {
    const conversations = await apiRequest(`${API_BASE_URL}/api/conversations`);

    conversationList.replaceChildren();

    conversationCount.textContent = conversations.length;

    if (historyEmpty) {
      historyEmpty.style.display =
        conversations.length === 0 ? "block" : "none";
    }

    conversations.forEach((conversation) => {
      const wrapper = document.createElement("div");
      wrapper.className = "conversation-item-wrapper";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "conversation-item";
      button.textContent = conversation.title || "New Conversation";
      button.title = conversation.title || "New Conversation";
      button.dataset.conversationId = String(conversation.id);

      if (conversation.id === currentConversationId) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        loadConversation(conversation.id);
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-conversation-btn";
      deleteButton.textContent = "×";
      deleteButton.title = "Delete conversation";
      deleteButton.setAttribute("aria-label", "Delete conversation");

      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteConversation(conversation.id, deleteButton);
      });

      wrapper.append(button, deleteButton);
      conversationList.appendChild(wrapper);
    });
  } catch (error) {
    console.error("Conversation history error:", error);

    if (getToken()) {
      showToast("Unable to load conversation history.", "error");
    }
  }
}

/* =========================================
   DELETE CONVERSATION
========================================= */

async function deleteConversation(conversationId, deleteButton) {
  if (isWaitingForResponse) {
    showToast("Please wait for the current response to finish.", "info");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this conversation and all its messages?",
  );

  if (!confirmed) {
    return;
  }

  deleteButton.disabled = true;

  try {
    await apiRequest(`${API_BASE_URL}/api/conversations/${conversationId}`, {
      method: "DELETE",
    });

    if (currentConversationId === conversationId) {
      currentConversationId = null;

      chatMessages.replaceChildren();

      if (welcomeScreen) {
        chatMessages.appendChild(welcomeScreen);
      }

      messageInput.value = "";
      messageInput.style.height = "auto";

      if (characterCount) {
        characterCount.textContent = "0";
      }
    }

    await loadConversations();

    showToast("Conversation deleted successfully.", "success");

    messageInput.focus();
  } catch (error) {
    console.error("Conversation deletion failed:", error);

    showToast(error.message || "Unable to delete this conversation.", "error");

    deleteButton.disabled = false;
  }
}

/* =========================================
   RESTORE A PREVIOUS CONVERSATION
========================================= */

async function loadConversation(conversationId) {
  try {
    const messages = await apiRequest(
      `${API_BASE_URL}/api/conversations/${conversationId}/messages`,
    );

    currentConversationId = conversationId;

    chatMessages.replaceChildren();

    messages.forEach((message) => {
      addMessage(
        message.content,
        message.sender.toLowerCase() === "user" ? "user" : "assistant",
      );
    });

    document.querySelectorAll(".conversation-item").forEach((button) => {
      button.classList.remove("active");
    });

    const selectedButton = Array.from(
      document.querySelectorAll(".conversation-item"),
    ).find((button) => {
      return button.dataset.conversationId === String(conversationId);
    });

    if (selectedButton) {
      selectedButton.classList.add("active");
    }

    messageInput.focus();
  } catch (error) {
    console.error("Load conversation error:", error);

    if (getToken()) {
      showToast("Could not load this conversation. Please try again.", "error");
    }
  }
}

/* =========================================
   INITIALIZE CHAT
========================================= */

async function initializeChat() {
  await loadConversations();

  if (!getToken()) {
    return;
  }

  try {
    const latestConversation =
      conversationList.querySelector(".conversation-item");

    if (latestConversation) {
      const conversationId = Number(latestConversation.dataset.conversationId);

      if (Number.isFinite(conversationId)) {
        await loadConversation(conversationId);
        return;
      }
    }

    chatMessages.replaceChildren();

    if (welcomeScreen) {
      chatMessages.appendChild(welcomeScreen);
    }
  } catch (error) {
    console.error("Chat initialization error:", error);
  }
}

/* =========================================
   MOBILE HISTORY
========================================= */

mobileHistoryBtn.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("mobile-open");

  mobileHistoryBtn.setAttribute("aria-expanded", String(isOpen));
});

closeMobileSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("mobile-open");

  mobileHistoryBtn.setAttribute("aria-expanded", "false");
});

const conversationHistory = document.getElementById("conversationHistory");

/* =========================================
   APPLICATION STARTUP
========================================= */

console.log("CodeAlpha AI Chatbot frontend initialized.");

restoreSession();
