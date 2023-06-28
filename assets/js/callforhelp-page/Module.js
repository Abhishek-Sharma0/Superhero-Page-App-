


const callForHelp = (() => {
	
	const display = document.querySelector(".helper-card");
	const template1 = document.querySelector("#template1").children[0];
	const template2 = document.querySelector("#template2").children[0];
	const template3 = document.querySelector("#template3").children[0];
	
	
	const helpMe = () => {
		
		if (display.children.length > 1) {
			display.children.forEach((child) => child.remove());
		}
		
		display.appendChild(template1.cloneNode(true));
	};
	
	
	const handleClick = (event) => {
		
		event.stopPropagation();
		
		const target = event.target;

		
		if (target.classList.contains("btn")) {
			
			event.preventDefault();

			
			if (target.previousElementSibling.children[1].value === "") {
				return;
			}

			
			display.querySelector(".card-body").remove();
			
			display.appendChild(template2.cloneNode(true));
			
			setTimeout(() => {
				
				display.querySelector(".wrapper").remove();
				
				display.appendChild(template3.cloneNode(true));
			}, 5000);
		}
	};
	
	
	const initializeApp = () => {
		
		document.addEventListener("click", handleClick);
		
		window.onload = () => {
			
			helpMe();
		};
	};
	
	return {
		initialize: initializeApp,
	};
})();

