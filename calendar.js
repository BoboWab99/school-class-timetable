// calendar

const data = [
   {
      title: 'Intro to DB',
      venue: 'Elgon',
      start: '08:15',
      duration: 1,
      day: 1
   },
   {
      title: 'Intro',
      venue: 'Kindaruma',
      start: '08:15',
      duration: 4,
      day: 1
   },
   {
      title: 'Testing',
      venue: 'Suswa',
      start: '08:15',
      duration: 3,
      day: 1
   },
   {
      title: 'Programming',
      venue: 'Longonot',
      start: '08:15',
      duration: 2,
      day: 1
   },
   {
      title: 'DSA',
      venue: 'Elgon',
      start: '14:15',
      duration: 3,
      day: 1
   },
   {
      title: 'Ethics',
      venue: 'Longonot',
      start: '09:15',
      duration: 3,
      day: 3
   },
   {
      title: 'Another one',
      venue: 'Elgon',
      start: '10:15',
      duration: 1,
      day: 3
   },
   {
      title: 'Coding',
      venue: 'Elgon',
      start: '15:15',
      duration: 2,
      day: 5
   },
   {
      title: 'Web dev',
      venue: 'Elgon',
      start: '17:30',
      duration: 3,
      day: 2
   },
   {
      title: 'Calculus',
      venue: 'Elgon',
      start: '08:15',
      duration: 3,
      day: 6
   }
]

data.sort((a, b) => b.duration - a.duration)

setTimeout(() => {
   data.forEach(course => {
      const rowId = `row${course.day}`
      const startCellId = `cell${course.day}${course.start.slice(0, 2) + course.start.slice(3)}`

      const row = document.getElementById(rowId)
      const cell = document.getElementById(startCellId)
      const startIndex = Array.from(row.children).indexOf(cell)
      const cells = Array.from(row.children).slice(startIndex, (startIndex + course.duration))

      const c = randomColor()
      let textColor = 'rgb(22 24 26)'
      if (contrast(c.code) < 4.8) {
         textColor = 'rgb(255 255 255 / .9)'
      }

      cells.forEach(el => {
         el.innerHTML += `
         <div class="lecture" role="button" style="color: ${textColor}; background-color: ${c.color}">
            <span class="lecture-title">${course.title}</span>
            <span class="lecture-venue">${course.venue}</span>
         </div>`
      })
   })
}, 1000);


// layout
// --------

const calendar = document.querySelector('.calendar')
const calendarHeader = calendar.querySelector('.calendar-header')
const calendarBody = calendar.querySelector('.calendar-body')

let start = new Date('2000-01-01T08:15:00')
let end = new Date('2000-01-01T20:30:00')
let mins = (end - start) / (1000 * 60)
let step = 15
let x = 0

const days = {
   1: 'Mon',
   2: 'Tue',
   3: 'Wed',
   4: 'Thu',
   5: 'Fri',
   6: 'Sat',
}

calendarHeader.innerHTML += `
<div class="calendar-row">
   <div class="calendar-cell calendar-cell--col-indicator">Day</div>
</div>`

for (let i = 1; i <= Object.keys(days).length; i++) {
   calendarBody.innerHTML += `
   <div class="calendar-row" id="row${i}">
      <div class="calendar-cell calendar-cell--row-indicator">${days[i]}</div>
   </div>`
}

for (let i = 0; i < mins; i += step) {

   if (start.toTimeString().slice(0, 5) == '17:15') {
      x = 45
   }

   if ((i + x) % 60 == 0) {
      let s = new Date(start.getTime())
      s.setHours((1 + s.getHours()))
      const sTime = start.toTimeString().slice(0, 5)
      const eTime = s.toTimeString().slice(0, 5)
      calendarHeader.querySelector('.calendar-row')
         .innerHTML += `<div class="calendar-cell">${sTime} - ${eTime}</div>`
      calendarBody.querySelectorAll('.calendar-row').forEach(el => {
         let id = el.getAttribute('id').slice(3)   /* row number */
         id += sTime.slice(0, 2) + sTime.slice(3)  /* time without colon : */
         el.innerHTML += `<div class="calendar-cell calendar-body-cell" id="cell${id}"></div>`
      })
   }

   start.setMinutes((start.getMinutes() + step))
}

// extras
// ------------

/**
 * @returns color code & rgb values array
 */
function randomColor() {
   const rand = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
   const r = rand(0, 255);
   const g = rand(0, 255);
   const b = rand(0, 255);
   return {
      color: `rgb(${r} ${g} ${b} / .9)`,
      code: [r, g, b]
   }
}

/**
 * https://stackoverflow.com/a/9733420
 * @param {Number} r 
 * @param {Number} g 
 * @param {Number} b 
 * @returns 
 */
function luminance(r, g, b) {
   var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ?
         v / 12.92 :
         Math.pow((v + 0.055) / 1.055, 2.4);
   });
   return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * 
 * @param {Array} rgb1 
 * @param {Array} rgb2 
 * @returns 
 */
function contrast(rgb1, rgb2 = [0, 0, 0]) {
   var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
   var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
   var brightest = Math.max(lum1, lum2);
   var darkest = Math.min(lum1, lum2);
   return (brightest + 0.05) / (darkest + 0.05);
}