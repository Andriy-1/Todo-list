
//=================
//Popups
let popup_link = document.querySelectorAll('._popup-link');
let popups = document.querySelectorAll('.popup');
for (let index = 0; index < popup_link.length; index++) {
	const el = popup_link[index];
	el.addEventListener('click', function (e) {
		if (unlock) {
			let item = el.getAttribute('href').replace('#', '');
			let video = el.getAttribute('data-video');
			popup_open(item, video);
		}
		e.preventDefault();
	})
}
for (let index = 0; index < popups.length; index++) {
	const popup = popups[index];
	popup.addEventListener("click", function (e) {
		if (!e.target.closest('.popup__body')) {
			popup_close(e.target.closest('.popup'));
		}
	});
}
function popup_open(item, video = '') {
	let activePopup = document.querySelectorAll('.popup._active');
	if (activePopup.length > 0) {
		popup_close('', false);
	}
	let curent_popup = document.querySelector('.popup_' + item);
	if (curent_popup && unlock) {
		if (video != '' && video != null) {
			let popup_video = document.querySelector('.popup_video');
			popup_video.querySelector('.popup__video').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video + '?autoplay=1"  allow="autoplay; encrypted-media" allowfullscreen></iframe>';
		}
		if (!document.querySelector('.menu__body._active')) {
			body_lock_add(500);
		}
		curent_popup.classList.add('_active');
		history.pushState('', '', '#' + item);
	}
}
function popup_close(item, bodyUnlock = true) {
	if (unlock) {
		if (!item) {
			for (let index = 0; index < popups.length; index++) {
				const popup = popups[index];
				let video = popup.querySelector('.popup__video');
				if (video) {
					video.innerHTML = '';
				}
				popup.classList.remove('_active');
			}
		} else {
			let video = item.querySelector('.popup__video');
			if (video) {
				video.innerHTML = '';
			}
			item.classList.remove('_active');
		}
		if (!document.querySelector('.menu__body._active') && bodyUnlock) {
			body_lock_remove(500);
		}
		history.pushState('', '', window.location.href.split('#')[0]);
	}
}
let popup_close_icon = document.querySelectorAll('.popup__close,._popup-close');
if (popup_close_icon) {
	for (let index = 0; index < popup_close_icon.length; index++) {
		const el = popup_close_icon[index];
		el.addEventListener('click', function () {
			popup_close(el.closest('.popup'));
		})
	}
}
document.addEventListener('keydown', function (e) {
	if (e.which == 27) {
		popup_close();
	}
});
//=================

const input = document.getElementById('input');
const btn = document.getElementById('btn');
const taskBox = document.querySelector('.todo');

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));

let todoItemElems = [];

function Task(discription) {
	this.discription = discription;
	this.complited = false;
};

const createTemplate = (task, index) => {
	return `
	<div class="todo__item ${task.complited ? 'checked' : ''}">
	<input onclick="compliteTask(${index})" type="checkbox"${task.complited ? 'checked' : ''} class="todo__input">
	<div class="todo__description">
		${task.discription}
	</div>
	<button onclick="deliteTask(${index})" class="todo__btn">Удалить</button>
</div>
	`
};

const fileterTask = () => {
	const activeTasks = tasks.length && tasks.filter(item => item.complited == false);
	const complitedTasks = tasks.length && tasks.filter(item => item.complited == true);
	tasks = [...activeTasks,...complitedTasks];

}

const fillHtmlList = () => {
	taskBox.innerHTML = "";
	if (tasks.length > 0) {
		fileterTask();
		tasks.forEach((item, index) => {
			taskBox.innerHTML += createTemplate(item, index)
		})
		todoItemElems = document.querySelectorAll('.todo__item');
	}

};

fillHtmlList();
const updateLocal = () => {
	localStorage.setItem('tasks', JSON.stringify(tasks))
};


const compliteTask = index => {
	tasks[index].complited = !tasks[index].complited;
	if (tasks[index].complited) {
		todoItemElems[index].classList.add('checked')
	} else {
		todoItemElems[index].classList.remove('checked')
	}
	updateLocal();
	fillHtmlList();
}

btn.addEventListener('click', () => {
	tasks.push(new Task(input.value));
	updateLocal();
	fillHtmlList();
	input.value = '';
});

const deliteTask = index => {
	todoItemElems[index].classList.add('_active')
	setTimeout(() => {
		tasks.splice(index, 1);
		updateLocal();
		fillHtmlList();
	}, 500)
}
