 // https://github.com/brookhong/Surfingkeys/wiki/Migrate-your-settings-from-0.9.74-to-1.0
const {
  aceVimMap,
  mapkey,
  imap,
  imapkey,
  vmap,
  getClickableElements,
  vmapkey,
  map,
  unmap,
  cmap,
  addSearchAlias,
  removeSearchAlias,
  tabOpenLink,
  readText,
  Clipboard,
  Front,
  Hints,
  Visual,
  unmapAllExcept,
  iunmap,
  RUNTIME
} = api;

var command_map = {};

function _parseAnnotation(ag) {
  var annotations = ag.annotation.match(/#(\d+)(.*)/);
  if (annotations !== null) {
    ag.feature_group = parseInt(annotations[1]);
    ag.annotation = annotations[2];
  }
  return ag;
}

function command(cmd, annotation, jscode) {
  var cmd_code = {
    code: jscode
  };
  var ag = _parseAnnotation({annotation: annotation, feature_group: 14});
  cmd_code.feature_group = ag.feature_group;
  cmd_code.annotation = ag.annotation;
  command_map[cmd] = cmd_code;
}

mapkey('<Ctrl-s>', 'Print all mappings to console', function () {
  const feature_groups = [
    'Help',                  // 0
    'Mouse Click',           // 1
    'Scroll Page / Element', // 2
    'Tabs',                  // 3
    'Page Navigation',       // 4
    'Sessions',              // 5
    'Search selected with',  // 6
    'Clipboard',             // 7
    'Omnibar',               // 8
    'Visual Mode',           // 9
    'vim-like marks',        // 10
    'Settings',              // 11
    'Chrome URLs',           // 12
    'Proxy',                 // 13
    'Misc',                  // 14
    'Insert Mode',           // 15
  ];

  let keyMappings = [Normal.mappings,
    Visual.mappings,
    Insert.mappings
  ].map(getAnnotations).reduce(function (a, b) {
    return a.concat(b);
  });

  keyMappings = keyMappings.map(annotation => {
    let category_name = feature_groups[annotation.feature_group];
    return {
      category: category_name,
      trigger: KeyboardUtils.decodeKeystroke(annotation.word) + ` (${category_name})`,
      description: annotation.annotation
    };
  });

  console.log(command_map);
  let commands = Object.keys(command_map).map((commandName) => {
    console.log("processing: " + commandName);
    let cmd = command_map[commandName];
    let category_name = feature_groups[cmd.feature_group];
    return {
      category: category_name,
      trigger: `:${commandName} (${category_name})`,
      description: cmd.annotation
    }
  });

  console.log(keyMappings.concat(commands));
  console.log(JSON.stringify(keyMappings.concat(commands)));
});
//------------

(function updateSearchAliases() {
  // //google to ss, stackoverflow to st
  // map('ss', 'sg');
  // map('st', 'ss');

  addSearchAlias('s', 'google', 'https://www.google.com/search?q=', 's', 'https://www.google.com/complete/search?client=chrome-omni&gs_ri=chrome-ext&oit=1&cp=1&pgcl=7&q=', function (response) {
    var res = JSON.parse(response.text);
    return res[1];
  });

  addSearchAlias('o', 'stackoverflow', 'http://stackoverflow.com/search?q=');
  addSearchAlias('f', 'surfingkey issues', 'https://github.com/brookhong/Surfingkeys/issues?q=');
  addSearchAlias('j', 'jira', 'https://ats.anexia-it.com/issues/?jql=text ~ "{0}" or summary ~ "{0}"  ');
  addSearchAlias('t', 'ticket', 'https://ats.anexia-it.com/browse/{0}');
  addSearchAlias('a', 'ai', 'https://andisearch.com/?query={0}');
  addSearchAlias('5', 'ticket', 'https://ats.anexia-it.com/browse/AMS-{0}');
})();

//swap edit url things, as I seem to be wanting edit and reload more then other one
map('su', 'sU');
// map('sU', 'su');
mapkey('+', 'Open Ticket', function () {
  tabOpenLink("https://ats.anexia-it.com/browse/AMS-" + prompt("AMS-", ""));
});
mapkey('sU', '#4Edit current URL with vim editor, and open in new tab', function () {
  Front.showEditor(window.location.href, function (data) {
    tabOpenLink(data);
  }, 'url');
});

Hints.setCharacters('aqwsedrftgbvcyx123')
Hints.style('font-size: 20px;');
settings.hintAlign = "left";

mapkey('cgc', 'gitlab project', function () {
  Clipboard.write(document.querySelector('#ssh_project_clone').value);
}, {domain: /code.anexia.com/i});

// Clean out "select to trigger inline query" list. Very annoying
settings.mouseSelectToQuery = [];
settings.focusFirstCandidate = true;

// Disable emoji popup. I can see it being potentially useful, but most of the time it's annoying and I already have this via Alfred
iunmap(":");

// map('P', 'cc');

unmap('q')

mapkey('qqm', 'Merge Requests', () => {
  tabOpenLink("https://code.anexia.com/dashboard/merge_requests?assignee_username=rwirnsberger")
});

mapkey('qqv', 'Vault', () => {
  tabOpenLink("https://vault-a8n.anexia-it.com/ui/vault/secrets")
});

mapkey('qqls', 'Localhost 1337', () => {
  tabOpenLink("http://localhost:1337")
});

mapkey('qqln', 'Localhost 3000', () => {
  tabOpenLink("http://localhost:3000")
});

mapkey('qqll', 'Localhost', () => {
  tabOpenLink("http://localhost")
});

mapkey('qqi', 'Intranet', () => {
  tabOpenLink("https://intranet.anexia-it.com")
});

mapkey('qqs', 'ATS Sprint Board', () => {
  tabOpenLink("https://ats.anexia-it.com/secure/RapidBoard.jspa?rapidView=430&projectKey=AMS&view=planning.nodetail&quickFilter=2801&quickFilter=3515&quickFilter=3213&issueLimit=100")
});

mapkey('qqt', 'Teams', () => {
  tabOpenLink("https://teams.microsoft.com");
});

mapkey('aa', 'Mute', () => {
  document.getElementById("microphone-button").click()
}, {domain: /teams.microsoft.com/i})

mapkey('qtm', 'Intranet MittagsPause', () => {
  document.querySelector("#clockin_reasons_dropdown > li:nth-child(6) > a").click()
  setTimeout(() => {
    document.querySelector("#my-presence-info-submit").click()
  }, 500)
}, {domain: /intranet.anexia-it.com/i})


mapkey('qtp', 'Intranet Pause', () => {
  document.querySelector("#clockin_reasons_dropdown > li:nth-child(7) > a").click()
  setTimeout(() => {
    document.querySelector("#my-presence-info-submit").click()
  }, 500)
}, {domain: /intranet.anexia-it.com/i})


mapkey('qtt', 'intranet default', () => {
  document.querySelector("#clockin_default").click()
  setTimeout(() => {
    document.querySelector("#my-presence-info-submit").click()
  }, 500)
}, {domain: /intranet.anexia-it.com/i})

mapkey('qth', 'Intranet Home office', () => {
  document.querySelector("#my_location_14").click()
  document.querySelector("#clockin_default").click()
  setTimeout(() => {
    document.querySelector("#my-presence-info-submit").click()
  }, 500)
}, {domain: /intranet.anexia-it.com/i})

mapkey(';n', '#3mute/unmute current tab', 'RUNTIME("muteTab")');