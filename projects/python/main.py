import random
import asyncio
from js import document  # type: ignore
from pyscript import ffi  # type: ignore

# Setup game state records
secret_number = random.randint(1, 100)
attempts = 0
game_over = False

# Select elements from HTML layout structures
log_div = document.getElementById("terminal-log")
input_field = document.getElementById("user-entry")

def terminal_print(text):
    """Custom printer that appends text lines cleanly inside the HTML box."""
    new_line = document.createElement("div")
    new_line.innerText = text
    log_div.appendChild(new_line)
    
    # Auto-scroll container box downwards
    box = document.getElementById("terminal-box")
    if box:
        box.scrollTop = box.scrollHeight

def process_guess(event):
    """Triggers every time the user hits Enter inside the text field."""
    global secret_number, attempts, game_over
    
    # Listen only for the Enter keypress
    if event.key != "Enter":
        return
        
    user_input = input_field.value.strip()
    input_field.value = "" # Instantly clear the field for the next turn
    
    if not user_input:
        return
        
    # Echo back what the user wrote into the terminal
    terminal_print(f"> {user_input}")

    if game_over:
        if user_input.lower() == 'y':
            secret_number = random.randint(1, 100)
            attempts = 0
            game_over = False
            terminal_print("\n" + "=" * 40)
            terminal_print("New round started! Think of a new number...")
            terminal_print("Enter your guess:")
        else:
            terminal_print("Thanks for playing! Type 'y' anytime to restart.")
        return

    if user_input.lower() == 'quit':
        terminal_print(f"Goodbye! The number was {secret_number}.")
        game_over = True
        return
        
    if not user_input.isdigit():
        terminal_print("❌ Invalid input. Please type a valid number.")
        return
        
    guess = int(user_input)
    attempts += 1
    
    if guess < secret_number:
        terminal_print("📈 Too low! Try a higher number.")
    elif guess > secret_number:
        terminal_print("📉 Too high! Try a lower number.")
    else:
        terminal_print(f"🎉 CORRECT! You found it in {attempts} attempts!")
        terminal_print("\nPlay again? (y/n)")
        game_over = True

async def start_up():
    """Initial text presentation loaded safely after elements register."""
    # Brief pause to ensure the browser has completely built the HTML layout
    await asyncio.sleep(0.1)
    
    terminal_print("=" * 40)
    terminal_print("      RETRO NUMBER GUESSING GAME        ")
    terminal_print("=" * 40)
    terminal_print("I am thinking of a number between 1 and 100.")
    terminal_print("Enter your guess:")
    
    # Bind our Python action handler cleanly using PyScript ffi proxy
    input_field.addEventListener("keydown", ffi.create_proxy(process_guess))

# Run the startup sequence safely inside the browser window engine
asyncio.ensure_future(start_up())
