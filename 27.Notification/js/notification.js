
update()

document.querySelector('.notification__form button').addEventListener('click', function() {
    let time = document.querySelector('.notification__form input').value
    let textarea = document.querySelector('.notification__form textarea').value

    let info = document.querySelector('.notification__info')

    if (!time || !textarea) {
        info.textContent = 'Укажите время и собщение'
        info.style.opacity = 1
        setTimeout(() => {
            info.style.opacity = 0
        }, 2000)
        setTimeout(() => {
            info.textContent = ''
        }, 2500)
        return
    } 
    localStorage.setItem(time, textarea)
    update()
})

document.querySelector('.notification__list > button').addEventListener('click', function() {
    if (localStorage.length && confirm('Очистить список уведомлений?')) {
        localStorage.clear()
        update()
        return
    }
    if (!localStorage.length) {
        alert('Уведомлений нет')
    }
})

function update() {
    if (!localStorage.length) {
        document.querySelector('.notification__list').hidden = true
    } else {
        document.querySelector('.notification__list').hidden = false
    }
    document.querySelector('.notification__list div').innerHTML = ''

    for (let key of Object.keys(localStorage)) {
        document.querySelector('.notification__list > div').insertAdjacentHTML('beforeend', `
        <div class="notification__item">
            <div>${key} - ${localStorage.getItem(key)}</div>
            <button data-time="${key}">&times;</button>
        </div>
        `) 
    }
    document.querySelector('.notification__form input').value = ''
    document.querySelector('.notification__form textarea').value = ''

    if (document.querySelector('.audioAlert')) {
        document.querySelector('.audioAlert').remove()
    }

}

document.querySelector('.notification__list').addEventListener('click', function(event) {
    if (!event.target.dataset.time) return
    localStorage.removeItem(event.target.dataset.time)
    update()
})

setInterval(() => {
    let currentDate = new Date()
    let currentHour = currentDate.getHours()
    if (currentHour < 10) {
        currentHour = '0' + currentHour
    }
    let currentMin = currentDate.getMinutes()
    if (currentMin < 10) {
        currentMin = '0' + currentMin
    }

    let currentTime = `${currentHour}:${currentMin}`
    for (let key of Object.keys(localStorage)) {
        let keyHour = key.split(':')[0]
        let keyMin = key.split(':')[1]

        if (key == currentTime || keyHour == currentHour && keyHour < currentHour) {
            document.querySelector(`button[data-time="${key}"]`).closest('.notification__item').classList.add('notification__warning')
            if (!document.querySelector('.audioAlert')) {
                document.querySelector('body').insertAdjacentHTML('afterbegin', `<audio loop class="audioAlert"><source src="../source/alert.mp3" type="audio/mpeg"></audio>`)
                document.querySelector('.audioAlert').play()
            }
        }

    }

    
}, 1000)