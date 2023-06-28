
const superHeroPage = (() => {
	const searchResultTitle = document.querySelector("#search-result-title");
	const searchResult = document.querySelector("#search-result");
	const template1 = document.querySelector("[data-superhero-template]");
	const template2 = document.querySelector("[data-nothing-template]");
	const template3 = document.querySelector("[data-superheroes-template]");
	const setSearchResultTitle = () => {
		searchResultTitle.textContent = `Search Results for '${localStorage.getItem(
			"superhero"
		)}'`;
	};
	const setHeartColor = (favouriteBtn, name) => {
		let arr = [];
		let item = name.trim().toLowerCase();
		if ("favourites" in localStorage) {
			arr = JSON.parse(localStorage.getItem("favourites"));
			if (arr.includes(item)) {
				favouriteBtn.style.color = "red";
			}
			else {
				favouriteBtn.style.color = "black";
			}
		}
		else {
			favouriteBtn.style.color = "black";
		}
	};
	const renderSuperhero = (superheroList) => {
		const superhero = template1.content.cloneNode(true).children[0];
		const name = superhero.querySelector("#name");
		const image = superhero.querySelector("#image img");
		const favouriteBtn = superhero.querySelector("#info .fav-btn");
		const progressBar = superhero.querySelectorAll(".progress-bar");
		const sections = superhero.querySelectorAll("section");
		let i = 0;

		name.textContent = superheroList[0].name;
		image.src = superheroList[0].image.url;
		favouriteBtn.setAttribute("data-id", superheroList[0].id);
		favouriteBtn.setAttribute("data-image-url", superheroList[0].image.url);

		setHeartColor(favouriteBtn, superheroList[0].name);

		for (let key in superheroList[0].powerstats) {
			let val = superheroList[0].powerstats[key];
			if (
				val === "null" ||
				val === undefined ||
				val === "undefined" ||
				val === null
			) {
				val = "NA";
			}
			progressBar[i].style.width = `${val}%`;
			progressBar[i].setAttribute("aria-valuenow", `${val}`);
			progressBar[i].textContent = `${val}%`;
			progressBar[i].parentElement.previousElementSibling.textContent =
				key.toLowerCase();
			i++;
		}

	
		for (let k = 1; k < 5; k++) {
			for (let j = 1; j < sections[k].children.length; j++) {
				let ele = sections[k].children[j].children[0];
				let val = ele.textContent.toLowerCase();
				let key = val.split(":").join("").trim();
				let content;

				switch (k) {
					case 1:
						content = superheroList[0].biography[key];
						break;
					case 2:
						content = superheroList[0].appearance[key];
						break;
					case 3:
						content = superheroList[0].connections[key];
						break;
					case 4:
						content = superheroList[0].work[key];
						break;
					default:
						content = "";
				}

				if (
					content === "null" ||
					content === null ||
					content === "undefined" ||
					content === undefined ||
					content === "" ||
					content === "-" ||
					content === " " ||
					content === "NA"
				) {
					content = "Not Available";
				}

				if (typeof content === "object") {
					content = content.join(", ");
				}

				ele.textContent = val.split("-").join(" ");
				ele.parentElement.append(content);
			}
		}

		searchResult.appendChild(superhero);
	};
	const multipleSuperheroes = (superheroList) => {
		const wrapper = document.createElement("div");
		wrapper.classList.add(
			"result",
			"row",
			"row-cols-1",
			"row-cols-md-3",
			"g-4"
		);

		superheroList.forEach((superhero) => {
			const superheroes = template3.content.cloneNode(true).children[0];
			const name = superheroes.querySelector(".card-title");
			const image = superheroes.querySelector("img");
			superheroes.setAttribute(
				"data-biography",
				JSON.stringify(superhero.biography)
			);
			superheroes.setAttribute(
				"data-connections",
				JSON.stringify(superhero.connections)
			);
			superheroes.setAttribute(
				"data-appearance",
				JSON.stringify(superhero.appearance)
			);
			superheroes.setAttribute("data-work", JSON.stringify(superhero.work));
			superheroes.setAttribute(
				"data-powerstats",
				JSON.stringify(superhero.powerstats)
			);
			superheroes.setAttribute("data-image-url", superhero.image.url);
			superheroes.setAttribute("data-name", superhero.name);

			name.textContent = superhero.name;
			image.src = superhero.image.url;
			wrapper.appendChild(superheroes);
		});

		searchResult.appendChild(wrapper);
	};
	const fetchSearchedHero = async () => {
		setSearchResultTitle();
		try {
			const value = localStorage.getItem("superhero").toLowerCase();
			const url = `https://superhero-hunter-app-mini-server.onrender.com/api/v1/superheroes/${value}`;
			const response = await fetch(url);
			let data = await response.json();
			data = data.data;

			searchResult.querySelectorAll("*").forEach((child) => child.remove());

			if (data.response === "error") {
				console.log("Error: " + data.error);
				const superhero = template2.content.cloneNode(true).children[0];
				searchResult.appendChild(superhero);
				return;
			}

			const superheroList = data.results;

			if (
				superheroList.length === 0 ||
				superheroList === undefined ||
				superheroList === null ||
				superheroList === "null" ||
				superheroList === "undefined"
			) {
				const superhero = template2.content.cloneNode(true).children[0];
				searchResult.appendChild(superhero);
				return;
			}
			if (superheroList.length === 1) {
				renderSuperhero(superheroList);
				return;
			} else {
				multipleSuperheroes(superheroList);
				return;
			}
		} catch (error) {
			console.log("Error in fetching the Searched Super Hero !!!", error);
		}
	};
	const handleClick = (event) => {
		event.stopPropagation();
		const target = event.target;

		if (!!searchResult.querySelector(".single-card")) {
			const superhero = document.querySelector(".single-card");
			const toast = superhero.querySelector(".toast");
			const name = superhero.querySelector("#name");
			const favouriteBtn = superhero.querySelector("#info .fav-btn");
			let arr = [];
			let images = [];
			let item = name.textContent.trim().toLowerCase();
			let url = favouriteBtn.getAttribute("data-image-url");
			toast.children[0].children[0].textContent = item;
			console.log(target);

			if (target.classList.contains("fav-btn")) {
				if ("favourites" in localStorage) {
					arr = JSON.parse(localStorage.getItem("favourites"));
					images = JSON.parse(localStorage.getItem("images"));

					if (arr.includes(item)) {
						arr = arr.filter((i) => i !== item);
						images = images.filter((obj) => obj.name !== item);
						favouriteBtn.style.color = "black";
						toast.children[1].children[0].textContent =
							"Removed from Favourites !!!";
					}
					else {
						arr.push(item);
						images.push({ name: item, image: url });
						favouriteBtn.style.color = "red";
						toast.children[1].children[0].textContent =
							"Added to Favourites !!!";
					}
				}
				else {
					arr.push(item);
					images.push({ name: item, image: url });
					favouriteBtn.style.color = "red";
					toast.children[1].children[0].textContent =
						"Added to Favourites !!!";
				}

				localStorage.setItem("favourites", JSON.stringify(arr));
				localStorage.setItem("images", JSON.stringify(images));
				toast.classList.add("show", "fadeLeft");
				setTimeout(() => {
					toast.classList.remove("show", "fadeLeft");
				}, 3000);
			}
		}

		if (searchResult.querySelectorAll(".card").length > 0) {
			let element;
			let name, image, biography, appearance, connections, work, powerstats;

			if (target.classList.contains("card-title")) {
				element = target.parentElement.parentElement.parentElement;
			}
			if (target.classList.contains("card-body")) {
				element = target.parentElement.parentElement;
			}
			if (target.classList.contains("card-img-top")) {
				element = target.parentElement.parentElement;
			}
			if (target.classList.contains("card")) {
				element = target.parentElement;
			}

			name = element.getAttribute("data-name");
			image = element.getAttribute("data-image-url");
			biography = JSON.parse(element.getAttribute("data-biography"));
			appearance = JSON.parse(element.getAttribute("data-appearance"));
			connections = JSON.parse(element.getAttribute("data-connections"));
			work = JSON.parse(element.getAttribute("data-work"));
			powerstats = JSON.parse(element.getAttribute("data-powerstats"));

			const superheroList = [
				{
					name: name,
					image: {
						url: image,
					},
					biography: biography,
					appearance: appearance,
					connections: connections,
					work: work,
					powerstats: powerstats,
				},
			];

			searchResult.querySelectorAll("*").forEach((child) => child.remove());
			localStorage.setItem("superhero", superheroList[0].name.toLowerCase());
			setSearchResultTitle();
			renderSuperhero(superheroList);
			return;
		}
	};
	const initializeApp = () => {
		document.addEventListener("click", handleClick);
		window.onload = () => {
			fetchSearchedHero();
		};
	};
	return {
		initialize: initializeApp,
	};
})();
