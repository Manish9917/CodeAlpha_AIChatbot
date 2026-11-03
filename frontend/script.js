// Configuration

const API_URL = "http://localhost:8080/api/chat";

// Theme Toggle Elements
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const themeToggleText = document.getElementById("themeToggleText");

// Apply selected theme
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const isDark = theme === "dark";

  themeToggleIcon.textContent = isDark ? "☀" : "☾";
  themeToggleText.textContent = isDark ? "Light Mode" : "Dark Mode";

  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
}

// Load saved theme
const savedTheme = localStorage.getItem("chatbot-theme") || "dark";
applyTheme(savedTheme);

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem("chatbot-theme", newTheme);
});

// Toast Notifications

const toastContainer = document.getElementById("toastContainer");

let toastIdCounter = 0;

function showToast(message, type = "success", duration = 3000) {
  if (!toastContainer) {
    console.warn("Toast container was not found:", message);
    return;
  }

  const toast = document.createElement("div");
  const toastId = `toast-${++toastIdCounter}`;

  toast.id = toastId;
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", type === "error" ? "alert" : "status");

  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.setAttribute("aria-hidden", "true");

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

  let dismissTimer;

  function dismissToast() {
    window.clearTimeout(dismissTimer);

    if (!toast.isConnected) {
      return;
    }

    toast.classList.add("toast-hiding");

    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });

    // Fallback in case the transition event does not fire.
    window.setTimeout(() => toast.remove(), 300);
  }

  closeButton.addEventListener("click", dismissToast);

  toast.append(icon, text, closeButton);
  toastContainer.appendChild(toast);

  // Limit the number of visible notifications.
  while (toastContainer.children.length > 4) {
    toastContainer.firstElementChild.remove();
  }

  dismissTimer = window.setTimeout(dismissToast, duration);

  return toast;
}

// DOM Elements

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const sendBtn = document.getElementById("sendBtn");
const newChatBtn = document.getElementById("newChatBtn");
const welcomeScreen = document.getElementById("welcomeScreen");

const conversationList = document.getElementById("conversationList");
const conversationCount = document.getElementById("conversationCount");
const mobileHistoryBtn = document.getElementById("mobileHistoryBtn");

// State

let isWaitingForResponse = false;
let currentConversationId = null;

// Create Message Bubble

function addMessage(text, sender) {
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
  bubble.textContent = text;

  content.append(name, bubble);

  // Add a copy button to assistant messages only.
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
        await copyTextToClipboard(text);

        copyButton.textContent = "Copied!";
        copyButton.classList.add("copied");
        copyButton.setAttribute("aria-label", "Response copied");

        showToast("Response copied successfully.", "success");

        window.setTimeout(() => {
          if (copyButton.isConnected) {
            copyButton.textContent = "Copy";
            copyButton.classList.remove("copied");
            copyButton.setAttribute("aria-label", "Copy AI response");
          }
        }, 1800);
      } catch (error) {
        console.error("Copy failed:", error);
        showToast("Unable to copy the response. Please try again.", "error");
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

// Copy text with a fallback for browsers without Clipboard API access.

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
  temporaryTextArea.style.top = "0";

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

// Scroll to Latest Message

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show Typing Indicator

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

  content.appendChild(name);
  content.appendChild(indicator);

  messageElement.appendChild(avatar);
  messageElement.appendChild(content);

  chatMessages.appendChild(messageElement);

  scrollToBottom();
}

// Remove Typing Indicator

function removeTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");

  if (indicator) {
    indicator.remove();
  }
}

// Update Input State

function setLoading(isLoading) {
  isWaitingForResponse = isLoading;
  sendBtn.disabled = isLoading;
  messageInput.disabled = isLoading;

  sendBtn.setAttribute("aria-busy", String(isLoading));
}

// Send Message to Backend

async function sendMessage(message) {
  const trimmedMessage = message.trim();

  if (!trimmedMessage || isWaitingForResponse) {
    return;
  }

  // Hide the welcome screen after the first message.
  if (welcomeScreen) {
    welcomeScreen.remove();
  }

  // Display the user's message.
  addMessage(trimmedMessage, "user");

  //Clear the input field.
  messageInput.value = "";
  messageInput.style.height = "auto";

  setLoading(true);
  showTypingIndicator();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: currentConversationId,
        message: trimmedMessage,
      }),
    });

    // Read the response body.
    const data = await response.json();

    // Handle HTTP errors returned by the backend.
    if (!response.ok) {
      const errorMessage = data.message || "The request could not be completed";

      throw new Error(errorMessage);
    }

    // Save the conversation ID returned by the backend.
    if (
      typeof data.conversationId === "number" &&
      Number.isFinite(data.conversationId)
    ) {
      currentConversationId = data.conversationId;

      // Refresh the sidebar history after receiving the conversation ID.
      await loadConversations();
    } else {
      throw new Error("The server returned an invalid conversation ID.");
    }

    // Display the chatbot's reply.
    if (typeof data.reply === "string") {
      addMessage(data.reply, "assistant");
    } else {
      throw new Error("The server returned an unexpected response.");
    }
  } catch (error) {
    console.error("Chat request failed:", error);

    addMessage(
      error.message || "Unable to connect to the chatbot. Please try again.",
      "assistant",
    );
  } finally {
    removeTypingIndicator();
    setLoading(false);
    messageInput.focus();
  }
}

// Handle Form Submission

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  sendMessage(messageInput.value);
});

// Enter to Send
// Shift + Enter for New Line

messageInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

// Auto-Resize Textarea

messageInput.addEventListener("input", function () {
  messageInput.style.height = "auto";

  messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + "px";
});

// Suggestion Buttons

document.querySelectorAll(".suggestion-btn").forEach(function (button) {
  button.addEventListener("click", function () {
    const suggestedMessage = button.dataset.message;

    if (suggestedMessage) {
      sendMessage(suggestedMessage);
    }
  });
});

// Start a New Chat

newChatBtn.addEventListener("click", function () {
  if (isWaitingForResponse) {
    return;
  }

  currentConversationId = null;

  chatMessages.replaceChildren();

  if (welcomeScreen) {
    chatMessages.appendChild(welcomeScreen);
  }

  messageInput.value = "";
  messageInput.style.height = "auto";
  messageInput.focus();
});

// Initial Setup

messageInput.focus();

console.log("AI Chatbot frontend initialized successfully.");

async function loadConversations() {
  try {
    const response = await fetch("http://localhost:8080/api/conversations");

    if (!response.ok) {
      throw new Error("Unable to load conversation history.");
    }

    const conversations = await response.json();

    conversationList.replaceChildren();
    conversationCount.textContent = conversations.length;

    if (conversations.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "history-empty";
      emptyMessage.textContent = "Your conversations will appear here.";
      conversationList.appendChild(emptyMessage);
      return;
    }

    conversations.forEach((conversation) => {
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

      conversationList.appendChild(button);
    });
  } catch (error) {
    console.error("Conversation history error:", error);
  }
}

async function loadConversation(conversationId) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/conversations/${conversationId}/messages`,
    );

    if (!response.ok) {
      throw new Error("Unable to load this conversation.");
    }

    const messages = await response.json();

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
    showToast("Could not load this conversation. Please try again.", "error");
  }
}

// Initialize conversation history and restore the latest conversation.

async function initializeChat() {
  await loadConversations();

  try {
    if (!conversationList) {
      return;
    }

    const latestConversation =
      conversationList.querySelector(".conversation-item");

    if (latestConversation) {
      const conversationId = Number(latestConversation.dataset.conversationId);

      if (Number.isFinite(conversationId)) {
        await loadConversation(conversationId);
      }
    }
  } catch (error) {
    console.error("Chat initialization error:", error);
    showToast("Unable to restore the previous conversation.", "error");
  }
}

initializeChat();

mobileHistoryBtn.addEventListener("click", () => {
  const conversationHistory = document.getElementById("conversationHistory");

  const isOpen = conversationHistory.classList.toggle("mobile-history-open");

  mobileHistoryBtn.setAttribute("aria-expanded", String(isOpen));
});
