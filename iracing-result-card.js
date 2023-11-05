class IracingResultCard extends HTMLElement {
  // Whenever the state changes, a new `hass` object is set. Use this to
  // update your content.
  
  set hass(hass) {
    // initialize configurable parameters
    const conf_max = Number(this.config.max) > 0 ? Number(this.config.max) : 3;
    const conf_title = this.config.title;
    
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const stateStr = state ? state.state : "unavailable";
    const json_results = hass.states[entityId].attributes.recent_results;
    const displayed_results_max = Math.min(json_results.length, conf_max, 5);
    window.cardSize = displayed_results_max;

    

    // Initialize the content if it's not there yet.
    if (!this.content) {
      const card = document.createElement("ha-card");
      card.header = conf_title ? conf_title : stateStr ;
      this.content = document.createElement("div");
      this.content.style.padding = "5px 10px";
      card.appendChild(this.content);
      this.appendChild(card);
    }


    if (!json_results || !json_results.length) {
      return;
    }
    this.content.innerHTML = "";
    const style = document.createElement("style");

    for (let count = 0; count < displayed_results_max; count++) {
      const item = (key) => json_results[count][key];
      const track = (key) => item('track')[key];
      console.log(item);

      const options = {
        weekday: "short",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      };
      const race_date = new Intl.DateTimeFormat(navigator.language, options).format(new Date(item("session_start_time")));
      

      const diff_ir = item("newi_rating") - item("oldi_rating");
      const diff_ir_prefix = (diff_ir >= 0 ? '+' : '')
      const diff_sr = (item("new_sub_level") - item("old_sub_level")) / 100;
      const diff_sr_prefix = (diff_sr >= 0 ? '+' : '')
      const new_sr = (item("new_sub_level")) / 100;
      let position_icon = '🏁';
      if (item("finish_position") == 1) {
        position_icon = '🥇';
      } else if (item("finish_position") == 2) {
        position_icon = '🥈';
      } else if (item("finish_position") == 3) {
        position_icon = '🥉';
      }

      this.content.innerHTML += `
        <div class="container">
          <div class="serie">
            ${item("series_name")}
          </div>
          <div class="circuit">
            ${track("track_name")}
          </div>
          <div class="result">
            ${position_icon} <b>P${item("finish_position")}</b> (Q${item("start_position")})
            <br>
            🔸 SOF <b>${item("strength_of_field")}</b>
          </div>
          <div class="ir_sr">
            📈 <b>${item("newi_rating")}</b> (${diff_ir_prefix}${diff_ir})
            <br>
            🚧 <b>${new_sr}</b> (${diff_sr_prefix}${diff_sr}) ${item("incidents")}x
          </div>
          <div class="date">
            ${race_date}
          </div>
        </div>          
        <br><br>
      `;

    }

    style.textContent = `
    .container {
      display: grid;
      padding: 3px;
      background-color: #F9F9F9;
      box-shadow: 1px 1px 2px rgba(0,0,0,.8);
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 0px 0px;
      grid-auto-flow: row;
      grid-template-areas:
        "serie serie result"
        "circuit circuit ir_sr"
        "date date date";
    }
    
    .serie {
      grid-area: serie;
      font-size: 16px;
      font-weight: 400;
    }
    
    .date {
      grid-area: date;
      font-size: 12px;
      text-align: left;
      padding-left: 20px;
    }
    
    .circuit {
      grid-area: circuit;
      font-size: 14px;
      font-weight: 600;
    }
    
    .result { grid-area: result; }
    
    .ir_sr { grid-area: ir_sr; }
    
    `;
    this.appendChild(style);

  }


  // The user supplied configuration. Throw an exception and Home Assistant
  // will render an error card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return window.cardSize;
  }
}

customElements.define("iracing-result-card", IracingResultCard);

