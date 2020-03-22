const Mainloop = imports.mainloop;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const Main = imports.ui.main;


let timeout;
let indicator;
const period = 5000;

// Use log(data) to log
function checkStatus() {
    const options = {
        timeout: 1,
    };
    const session = new Soup.Session(options);
    const url = "https://nordvpn.com/wp-admin/admin-ajax.php";
    const params = {
        "action": "get_user_info_data",
    };
    const message = Soup.form_request_new_from_hash("GET", url, params);
    session.queue_message(message, function(session, message) {
        if (message.status_code === 200) {
            const data = JSON.parse(message.response_body.data);
            if (data.status) {
                // log(data.status);
                indicator.set_label("vpn");
                indicator.set_style("color: #2DDE0D;");
                return;
            }
        }
        indicator.set_label("");
    });
}

// eslint-disable-next-line no-unused-vars
function init() {
}

// eslint-disable-next-line no-unused-vars
function enable() {
    indicator = new St.Button();
    indicator.set_label("...");
    Main.panel._rightBox.insert_child_at_index(indicator, 0);
    timeout = Mainloop.timeout_add(period, function() {
        checkStatus();
        return true;
    });
}

// eslint-disable-next-line no-unused-vars
function disable() {
    indicator.destroy();
    Mainloop.source_remove(timeout);
}
