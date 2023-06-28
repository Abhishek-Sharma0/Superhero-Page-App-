


const favouriteSuperheroPage = (() => {
	
	const result = document.querySelector(".result");
	const template = document.querySelector("[data-template]");
	const template2 = document.querySelector("[data-empty]");
	
	
	const renderCards = (name, image) => {
		
		const superhero = template.content.cloneNode(true).children[0];
		const img = superhero.querySelector("img");
		const superheroName = superhero.querySelector(".card-title");

		
		img.src = image;
		
		img.setAttribute("data-image-url", image);
		
		superheroName.textContent = name;
		
		superheroName.setAttribute("data-name", name);

		
		result.appendChild(superhero);
	};
	
	
	const fetchFavouriteSuperHeroes = () => {
		
		const favourites = JSON.parse(localStorage.getItem("favourites")); 
		const images = JSON.parse(localStorage.getItem("images"));

		
		result.querySelectorAll("*").forEach((element) => {
			element.remove();
		});

		
		if ("favourites" in localStorage) {
			
			if (favourites.length > 0) {
				
				for (let favourite of favourites) {
					const name = favourite;
					const image = images.filter((image) => image.name === name)[0]
						.image;
					
					renderCards(name, image);
				}
			}
		}

		
		if (!("favourites" in localStorage)) {
			
			const superhero = template2.content.cloneNode(true).children[0];
			result.appendChild(superhero);
		}

		
		if (favourites.length === 0) {
			
			const superhero = template2.content.cloneNode(true).children[0];
			result.appendChild(superhero);
		}
	};
	
	
	const handleClick = (event) => {
		
		event.stopPropagation();
		
		const target = event.target;

		
		if (result.querySelectorAll(".card").length > 0) {
			let val = "";

			
			if (target.classList.contains("card-title")) {
				val = target.getAttribute("data-name");
			}
			
			if (target.classList.contains("card-body")) {
				val = target.children[0].getAttribute("data-name");
			}
			
			if (target.classList.contains("card-img-top")) {
				val =
					target.nextElementSibling.children[0].getAttribute("data-name");
			}
			
			if (target.classList.contains("card")) {
				val = target.querySelector(".card-title").getAttribute("data-name");
			}
			
			if (target.classList.contains("remove-btn")) {
				
				event.preventDefault();
				
				const name =
					target.previousElementSibling.getAttribute("data-name");
				
				let favourites = JSON.parse(localStorage.getItem("favourites"));
				let images = JSON.parse(localStorage.getItem("images"));
				
				favourites = favourites.filter((favourite) => favourite !== name);
				images = images.filter((obj) => obj.name !== name);
				
				localStorage.setItem("favourites", JSON.stringify(favourites));
				localStorage.setItem("images", JSON.stringify(images));
				
				window.location.reload();
				return;
			}

			
			localStorage.setItem("superhero", val);
			

			window.location.href = "./superhero-page.html";
		}
	};
	
	
	const initializeApp = () => {
		
		document.addEventListener("click", handleClick);
		
		window.onload = () => {
			
			fetchFavouriteSuperHeroes();
		};
	};
	
	return {
		initialize: initializeApp,
	};
})();

