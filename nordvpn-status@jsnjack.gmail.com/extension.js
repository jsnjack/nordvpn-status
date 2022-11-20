const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const {Soup, GLib, St} = imports.gi;

let timeout;
let indicator;
const period = 5000;
// https://gjs-docs.gnome.org/soup30~3.2.2/soup.message#constructor-new_from_encoded_form

// Use log(data) to log
function checkStatus() {
    const session = new Soup.Session();
    session.set_timeout(4);
    const url = "https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data";
    const message = Soup.Message.new("GET", url);
    session.send_and_read_async(
        message,
        GLib.PRIORITY_DEFAULT,
        null,
        (session, result) => {
            if (message.get_status() === Soup.Status.OK) {
                let bytes = session.send_and_read_finish(result);
                let decoder = new TextDecoder("utf-8");
                let response = decoder.decode(bytes.get_data());
                const data = JSON.parse(response);
                if (data.status) {
                    indicator.set_label("vpn");
                    indicator.set_style("color: #2DDE0D;");
                    return;
                }
            }
            indicator.set_label("");
        }
    );
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
