// calendar

const data = [
   {
      title: 'Testing',
      venue: 'Suswa',
      start: '09:15',
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
      title: 'Programming',
      venue: 'Longonot',
      start: '08:15',
      duration: 2,
      day: 3
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
      title: 'Web dev',
      venue: 'Elgon',
      start: '17:30',
      duration: 3,
      day: 1
   },
   {
      title: 'Calculus',
      venue: 'Elgon',
      start: '08:15',
      duration: 3,
      day: 6
   },
   {
      title: 'Database Systems',
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
      title: 'Intro',
      venue: 'Kindaruma',
      start: '13:15',
      duration: 2,
      day: 3
   },
   {
      title: 'Intro',
      venue: 'Kindaruma',
      start: '12:15',
      duration: 2,
      day: 2
   },
   {
      title: 'Testing',
      venue: 'Kindaruma',
      start: '11:15',
      duration: 4,
      day: 2
   },
   {
      title: 'Calculus',
      venue: 'Elgon',
      start: '08:15',
      duration: 3,
      day: 2
   },
]

// arrange data by day
let dayData = {}

const arrangeData = (dayBookings, day = 1) => {
   let sorted = []
   let counter = 0
   sorted[counter] = []
   let dBookings = [...dayBookings]

   const arrange = (startIndex = 0) => {

      if (dBookings.length == 0) return

      const start = dBookings[startIndex]
      if (JSON.stringify(start) !== JSON.stringify(sorted[counter][sorted[counter].length - 1])) {
         sorted[counter].push(start)
         // console.log(start)
         bookingItemUI(start, counter)
      }

      /* console.log('prev!');
      console.log(sorted[counter][sorted[counter].length - 1]); */

      if (dBookings.length == 1) {
         return
      }

      let nextIndex = nextValidTo(startIndex)
      dBookings.splice(startIndex, 1)
      /* console.log('start');
      console.log(start); */

      if (nextIndex == -1) {
         counter++
         sorted[counter] = []
         arrange()

      } else {
         nextIndex--
         const next = dBookings[nextIndex]
         sorted[counter].push(next)
         bookingItemUI(next, counter)
         // arrayRemove(monBookings, next)
         /* console.log('next');
         console.log(next);
         console.log('---------------------'); */
         arrange(nextIndex)
      }
   }

   /**
    * @param {Number} index 
    * @returns 
    */
   const nextValidTo = (index) => {
      const booking = dBookings[index]

      const start1 = new Date(`2000-01-01T${booking.start}:00`)
      let end1 = new Date(start1)
      end1.setHours(booking.duration + end1.getHours())

      for (let k = index + 1; k < dBookings.length; k++) {
         const start2 = new Date(`2000-01-01T${dBookings[k].start}:00`)
         if (end1 <= start2) {
            return k
         }
      }

      return -1
   }

   arrange()

   const row = document.getElementById(`row${day}`)
   row.style.setProperty('--rowspan', sorted.length)

   return sorted
}

// wait 1 second before filling table

setTimeout(() => {

   // arrange data
   for (let i = 1; i <= Object.keys(days).length; i++) {
      let raw = data.filter(booking => booking.day == i)
      raw.sort((a, b) => a.start.localeCompare(b.start) || (a.duration - b.duration))
      dayData[i] = arrangeData(raw, i)
   }

   console.log(dayData);

}, 1000);


// layout
// --------

const calendar = document.querySelector('.calendar')
const calendarHeader = calendar.querySelector('.calendar-header')
const calendarBody = calendar.querySelector('.calendar-body')

let start = new Date('2000-01-01T08:15:00')
let end = new Date('2000-01-01T20:30:00')
let mins = (end - start) / (1000 * 60)
let step = 15 /* minutes */

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

   // 1-hour difference btwn time labels

   let sTime = start.toTimeString().slice(0, 5)
   let sTimeLabel = (i % 60 == 0) ? sTime : ''

   calendarHeader.querySelector('.calendar-row')
      .innerHTML += `<div class="calendar-cell"><span class="time-indicator">${sTimeLabel}</span></div>`
      
   calendarBody.querySelectorAll('.calendar-row').forEach(row => {
      let rowId = row.getAttribute('id').slice(3)   /* row number */
      rowId += removeColon(sTime)  /* time without colon : */
      row.innerHTML += `<div class="calendar-cell calendar-body-cell" id="cell${rowId}"></div>`
   })

   start.setMinutes((start.getMinutes() + step))
}

/**
 * @param {String} s time string H:M
 */
function removeColon(s) {
   return s.slice(0, 2) + s.slice(3)
}

/**
 * @param {Object} course 
 * @param {Number} top 
 */
function bookingItemUI(course, top = 0) {
   const startCellId = `cell${course.day}${removeColon(course.start)}`
   const startCell = document.getElementById(startCellId)
   const colspan = 4 * course.duration

   const c = randomColor()
   let textColor = 'rgb(22 24 26)'
   if (contrast(c.code) < 4.8) {
      textColor = 'rgb(255 255 255 / .9)'
   }

   startCell.innerHTML += `<div class="calendar-booking-item" style="--top: ${top}; --colspan: ${colspan}">
      <div class="lecture" role="button" style="color: ${textColor}; background-color: ${c.color}">
         <span class="lecture-title">${course.title}</span>
         <span class="lecture-venue">${course.venue} - ${course.duration} hrs</span>
      </div>
   </div>`
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