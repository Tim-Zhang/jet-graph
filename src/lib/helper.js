import {FetchBinaryURLAsync} from './binaryXHR'

export default {
  async fetchRrd(url) {
    return new Promise(resolve => {
      FetchBinaryURLAsync(url, resolve)
    })
  },

  getLocaleTimeString(dateOrTimestamp) {
    const d = new Date(dateOrTimestamp)
    const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('-')
    const time = [d.getHours(), d.getMinutes(), d.getSeconds()].map(v => v.toString().padStart(2, '0')).join(':')
    return `${date} ${time}`
  },

  getRraLabel(rra) {
    const step = rra.getStep()
    const rows = rra.getNrRows()
    const period = step * rows
    return `${this.rfsFormatTime(step)} (${this.rfsFormatTime(period)} total) ${rra.getCFName()}`
  },

  rfsFormatTime(s) {
    if (s<120) {
      return s+"s";
    } else {
      var s60=s%60;
      var m=(s-s60)/60;
      if ((m<10) && (s60>9)) {
        return m+":"+s60+"min";
      } if (m<120) {
        return m+"min";
      } else {
        var m60=m%60;
        var h=(m-m60)/60;
        if ((h<12) && (m60>9)) {
          return h+":"+m60+"h";
        } if (h<48) {
          return h+"h";
        } else {
          var h24=h%24;
          var d=(h-h24)/24;
          if ((d<7) && (h24>0)) {
            return d+" days "+h24+"h";
          } if (d<60) {
            return d+" days";
          } else {
            var d30=d%30;
            var mt=(d-d30)/30;
            return mt+" months";
          }
        }
      }
    }
  },



}