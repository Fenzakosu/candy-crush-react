import { useEffect, useState } from "react";
import ScoreBoard from "./components/ScoreBoard";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.jpg";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.jpg";
import blank from "./images/blank.png";

const width = 8;
const candyColors = [
	blueCandy,
	greenCandy,
	orangeCandy,
	purpleCandy,
	redCandy,
	yellowCandy,
];

const App = () => {
	const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
	const [squareBeingDragged, setSquareBeingDragged] = useState(null);
	const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
	const [scoreDisplay, setScoreDisplay] = useState(0);

	const checkForColumnOfThree = () => {
		for (let i = 0; i <= 47; i++) {
			const columnOfThree = [i, i + width, i + width * 2];
			const decidedColor = currentColorArrangement[i];
			const isBlank = decidedColor === blank;

			if (
				columnOfThree.every(
					(square) =>
						currentColorArrangement[square] === decidedColor && !isBlank
				)
			) {
				setScoreDisplay((prevScore) => prevScore + 3);
				columnOfThree.forEach(
					(square) => (currentColorArrangement[square] = blank)
				);
				return true;
			}
		}
	};

	const checkForColumnOfFour = () => {
		for (let i = 0; i <= 39; i++) {
			const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
			const decidedColor = currentColorArrangement[i];
			const isBlank = decidedColor === blank;

			if (
				columnOfFour.every(
					(square) =>
						currentColorArrangement[square] === decidedColor && !isBlank
				)
			) {
				setScoreDisplay((prevScore) => prevScore + 4);
				columnOfFour.forEach(
					(square) => (currentColorArrangement[square] = blank)
				);
				return true;
			}
		}
	};
	const checkForRowOfThree = () => {
		let row = 1;

		for (let i = 0; i < 62; i++) {
			if (row * width - 2 === i) {
				continue;
			}

			if (row * width - 1 === i) {
				row++;
				continue;
			}

			const rowOfThree = [i, i + 1, i + 2];
			const decidedColor = currentColorArrangement[i];
			const isBlank = decidedColor === blank;

			if (
				rowOfThree.every(
					(square) =>
						currentColorArrangement[square] === decidedColor && !isBlank
				)
			) {
				setScoreDisplay((prevScore) => prevScore + 3);
				rowOfThree.forEach(
					(square) => (currentColorArrangement[square] = blank)
				);
				return true;
			}
		}
	};

	const checkForRowOfFour = () => {
		let row = 1;

		for (let i = 0; i < 61; i++) {
			if (row * width - 3 === i) {
				continue;
			}

			if (row * width - 2 === i) {
				continue;
			}

			if (row * width - 1 === i) {
				row++;
				continue;
			}

			const rowOfFour = [i, i + 1, i + 2, i + 3];
			const decidedColor = currentColorArrangement[i];
			const isBlank = decidedColor === blank;

			if (
				rowOfFour.every(
					(square) =>
						currentColorArrangement[square] === decidedColor && !isBlank
				)
			) {
				setScoreDisplay((prevScore) => prevScore + 4);
				rowOfFour.forEach(
					(square) => (currentColorArrangement[square] = blank)
				);
				return true;
			}
		}
	};

	const moveIntoSquareBelow = () => {
		for (let i = 0; i < 64 - width; i++) {
			const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
			const isFirstRow = firstRow.includes(i);

			if (isFirstRow && currentColorArrangement[i] === blank) {
				const randomColor =
					candyColors[Math.floor(Math.random() * candyColors.length)];
				currentColorArrangement[i] = randomColor;
			}

			if (currentColorArrangement[i + width] === blank) {
				currentColorArrangement[i + width] = currentColorArrangement[i];
				currentColorArrangement[i] = blank;
			}
		}
	};

	const dragStart = (e) => {
		setSquareBeingDragged(e.target);
	};

	const dragDrop = (e) => {
		setSquareBeingReplaced(e.target);
	};

	const dragEnd = () => {
		const squareBeingDraggedId = parseInt(
			squareBeingDragged.getAttribute("data-id")
		);
		const squareBeingReplacedId = parseInt(
			squareBeingReplaced.getAttribute("data-id")
		);

		currentColorArrangement[squareBeingReplacedId] =
			squareBeingDragged.getAttribute("src");
		currentColorArrangement[squareBeingDraggedId] =
			squareBeingReplaced.getAttribute("src");

		const validMoves = [
			squareBeingDraggedId - 1,
			squareBeingDraggedId - width,
			squareBeingDraggedId + 1,
			squareBeingDraggedId + width,
		];

		const validMove = validMoves.includes(squareBeingReplacedId);

		const isColumnOfFour = checkForColumnOfFour();
		const isRowOfFour = checkForRowOfFour();
		const isColumnOfThree = checkForColumnOfThree();
		const isRowOfThree = checkForRowOfThree();

		if (
			squareBeingReplacedId &&
			validMove &&
			(isColumnOfFour || isRowOfFour || isColumnOfThree || isRowOfThree)
		) {
			setSquareBeingDragged(null);
			setSquareBeingReplaced(null);
		} else {
			currentColorArrangement[squareBeingReplacedId] =
				squareBeingReplaced.getAttribute("src");
			currentColorArrangement[squareBeingDraggedId] =
				squareBeingDragged.getAttribute("src");
			setCurrentColorArrangement([...currentColorArrangement]);
		}
	};

	const createBoard = () => {
		const randomColorArrangement = [];

		for (let i = 0; i < width * width; i++) {
			const randomColor =
				candyColors[Math.floor(Math.random() * candyColors.length)];
			randomColorArrangement.push(randomColor);
		}
		setCurrentColorArrangement(randomColorArrangement);
	};

	useEffect(() => {
		createBoard();
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			checkForColumnOfFour();
			checkForRowOfFour();
			checkForColumnOfThree();
			checkForRowOfThree();
			moveIntoSquareBelow();
			setCurrentColorArrangement([...currentColorArrangement]);
		}, 500);
		return () => clearInterval(timer);
	}, [
		checkForColumnOfFour,
		checkForRowOfFour,
		checkForColumnOfThree,
		checkForRowOfThree,
		moveIntoSquareBelow,
		currentColorArrangement,
	]);

	return (
		<div className="app">
			<div className="game">
				{currentColorArrangement.map((candyColor, index) => (
					<img
						key={index}
						src={candyColor}
						alt={candyColor}
						data-id={index}
						draggable={true}
						onDragStart={dragStart}
						onDragOver={(e) => e.preventDefault()}
						onDragEnter={(e) => e.preventDefault()}
						onDragLeave={(e) => e.preventDefault()}
						onDrop={dragDrop}
						onDragEnd={dragEnd}
					/>
				))}
			</div>
			<ScoreBoard score={scoreDisplay} />
		</div>
	);
};

export default App;
