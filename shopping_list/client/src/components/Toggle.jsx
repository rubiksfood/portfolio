export default function Toggle() {
    return (
        <div class="flex items-center justify-center">
            <div class="flex items-center">
                <input
                type="checkbox"
                id="toggleSwitch"
                class="hidden"
                onchange="toggleSwitch(this)"
                />
                <label
                for="toggleSwitch"
                class="select-none relative inline-flex h-6 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer bg-[#E6E6E6]"
                >
                <span
                    id="toggleText"
                    class="absolute w-full text-xs transition-transform duration-200 text-right pr-1.5 text-black"
                >
                    NEED
                </span>
                <span
                    id="toggleBall"
                    class="inline-block w-[17px] h-[17px] transform rounded-full bg-white transition-transform duration-200 translate-x-1"
                ></span>
                </label>
            </div>
        </div>
    );
}

function toggleSwitch(input) {
    const label = input.nextElementSibling;
    const text = label.querySelector("#toggleText");
    const ball = label.querySelector("#toggleBall");

    if (input.checked) {
    label.classList.add("bg-[#0E947A]");
    label.classList.remove("bg-[#E6E6E6]");
    text.textContent = "ON";
    text.classList.remove("text-black", "text-right", "pr-1.5");
    text.classList.add("text-white", "text-left", "pl-2");
    ShopItem.classList.add("line-through");
    ball.style.transform = "translateX(36px)";
    } else {
    label.classList.add("bg-[#E6E6E6]");
    label.classList.remove("bg-[#0E947A]");
    text.textContent = "GOT";
    text.classList.remove("text-white", "text-left", "pl-2");
    text.classList.add("text-black", "text-right", "pr-1.5");
    ShopItem.classList.remove("line-through");
    ball.style.transform = "translateX(4px)";
    }
}
