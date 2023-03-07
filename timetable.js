// dynamic school class timetable #frontend

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
      duration: 2,
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
      start: '10:15',
      duration: 3,
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
      duration: 3,
      day: 2
   },
   {
      title: 'Calculus',
      venue: 'Elgon',
      start: '08:15',
      duration: 3,
      day: 2
   },
   {
      title: 'IT Innovation Webiner',
      venue: 'Boardroom',
      start: '10:00',
      duration: 5,
      day: 5
   },
]

const days = {
   1: 'Mon',
   2: 'Tue',
   3: 'Wed',
   4: 'Thu',
   5: 'Fri',
   6: 'Sat',
}

const startTime = '08:15'  /* classes start time */
const endTime = '20:30'    /* classes end time */
const step = 15            /* timetable cell span (minutes) */


/**
 * Prints background timetable cells
 * @param {HTMLElement} placeholder
 */
const timetableLayout = async (placeholder) => {

   placeholder.innerHTML = `
   <div class="timetable">
      <div class="timetable-header"></div>
      <div class="timetable-body"></div>
   </div>`

   const timetableHeader = placeholder.querySelector('.timetable-header')
   const timetableBody = placeholder.querySelector('.timetable-body')

   const start = new Date(dateString(startTime))   
   const end = new Date(dateString(endTime))     
   const mins = (end - start) / (1000 * 60)

   timetableHeader.innerHTML += `
      <div class="timetable-row">
         <div class="timetable-cell timetable-cell--col-indicator"><span>Day</span></div>
      </div>`

   for (let i = 1; i <= Object.keys(days).length; i++) {
      timetableBody.innerHTML += `
      <div class="timetable-row" id="row${i}">
         <div class="timetable-cell timetable-cell--row-indicator"><span>${days[i]}</span></div>
      </div>`
   }

   for (let i = 0; i < mins; i += step) {

      let sTime = start.toTimeString().slice(0, 5)
      let sTimeLabel = (i % 60 == 0) ? sTime : ''  /* 1-hour difference between time labels */

      timetableHeader.querySelector('.timetable-row')
         .innerHTML += `<div class="timetable-cell"><span class="time-indicator">${sTimeLabel}</span></div>`

      timetableBody.querySelectorAll('.timetable-row').forEach(row => {
         let id = row.getAttribute('id').slice(3)   /* row number */
         id += removeColon(sTime)  /* time without colon : */
         row.innerHTML += `<div class="timetable-cell timetable-body-cell" id="cell${id}"></div>`
      })

      start.setMinutes((start.getMinutes() + step))
   }
}

/**
 * Arranges day data and fills the timetable
 * @param {Array} dayBookings 
 * @param {Number} day 
 * @returns 
 */
const arrangeFillData = (dayBookings, day = 1) => {
   let sorted = []
   let counter = 0
   sorted[counter] = []
   let dBookings = [...dayBookings]

   const arrange = (startIndex = 0) => {

      if (dBookings.length == 0) return

      const start = dBookings[startIndex]
      if (JSON.stringify(start) !== JSON.stringify(sorted[counter][sorted[counter].length - 1])) {
         sorted[counter].push(start)
         bookingItemUI(start, counter)
      }

      if (dBookings.length == 1) {
         return
      }

      let nextIndex = nextValidTo(startIndex)
      dBookings.splice(startIndex, 1)

      if (nextIndex == -1) {
         counter++
         sorted[counter] = []
         arrange()

      } else {
         nextIndex--
         const next = dBookings[nextIndex]
         sorted[counter].push(next)
         bookingItemUI(next, counter)
         arrange(nextIndex)
      }
   }

   /**
    * @param {Number} index 
    * @returns index of the booking that can come after current booking in the interval [startTime-endTime]
    */
   const nextValidTo = (index) => {
      const booking = dBookings[index]

      const start1 = new Date(dateString(booking.start))
      let end1 = new Date(start1)
      end1.setHours(booking.duration + end1.getHours())

      for (let k = index + 1; k < dBookings.length; k++) {
         const start2 = new Date(dateString(dBookings[k].start))
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

/**
 * Prints the timetable
 * @param {HTMLElement} placeholder 
 * @param {Array} data array of class bookings
 */
const initTimetable = async (placeholder, data) => {

   await timetableLayout(placeholder)

   let sortedDayData = {}

   for (let i = 1; i <= Object.keys(days).length; i++) {
      let dayData = data.filter(booking => booking.day == i)
      dayData.sort((a, b) => a.start.localeCompare(b.start) || (a.duration - b.duration))
      sortedDayData[i] = arrangeFillData(dayData, i)
   }

   console.log(sortedDayData);
}


// helpers
// ------------

/**
 * @param {String} timeString 
 * @returns date string
 */
function dateString(timeString) {
   return `2000-01-01T${timeString}:00`
}

/**
 * @param {String} timeString time string H:M
 */
function removeColon(timeString) {
   return timeString.slice(0, 2) + timeString.slice(3)
}

/**
 * @param {Object} course 
 * @param {Number} top 
 */
function bookingItemUI(course, top = 0) {
   const startCellId = `cell${course.day}${removeColon(course.start)}`
   const startCell = document.getElementById(startCellId)
   const colspan = 4 * course.duration

   const {color, code} = randomColor()
   let textColor = 'rgb(22 24 26)'
   if (contrast(code) < 4.8) {
      textColor = 'rgb(255 255 255 / .9)'
   }

   startCell.innerHTML += `
   <div class="timetable-booking-item" style="--top: ${top}; --colspan: ${colspan}">
      <div class="lecture" role="button" style="color: ${textColor}; background-color: ${color}">
         <span class="lecture-title">${course.title}</span>
         <span class="lecture-venue">${course.venue} - ${course.duration} hrs</span>
      </div>
   </div>`
}


// extras
// ------------

/**
 * @returns random rgb color & rgb values array
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
   let a = [r, g, b].map(function (v) {
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
   let lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
   let lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
   let brightest = Math.max(lum1, lum2);
   let darkest = Math.min(lum1, lum2);
   return (brightest + 0.05) / (darkest + 0.05);
}


// Testing

initTimetable(document.getElementById('myTimetable'), data)