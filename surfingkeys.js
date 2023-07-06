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
Hints.style('font-size: 26px;');
settings.hintAlign = "left";

mapkey('yt', "#7Copy last part of page URL", function () {
  Hints.create('*[href]', function (element) {
    let parts = element.href.split('/');
    let lastSegment = parts.pop() || parts.pop(); // to handle case with trailing '/'

    Clipboard.write(lastSegment);
  });
});

mapkey('cp', 'gitlab project', function () {
  Hints.create(".project-details h2 a, .project-details a.merge-requests", Hints.dispatchMouseClick);
}, {domain: /code.anexia.com/i});

mapkey(';cs', 'gitlab project', function () {
  Clipboard.write(document.querySelector('#ssh_project_clone').value);
}, {domain: /code.anexia.com/i});

// Clean out "select to trigger inline query" list. Very annoying
settings.mouseSelectToQuery = [];
settings.focusFirstCandidate = true;

// Disable emoji popup. I can see it being potentially useful, but most of the time it's annoying and I already have this via Alfred
iunmap(":");

map('P', 'cc');

unmap('q')
// exchange
// prescreen
// add bookmarks


mapkey('qgwk', 'Google Keep (Personal)', () => {
  window.location = encodeURI("https://keep.google.com/#LIST/1ZNf2N8vlCtTOSs1NVRvKiHV1Cm-2AFmAbANIdZsc5Gg_KX2zYhq5AJ1sVP-_cuY")
});
mapkey('qgak', 'Google Keep (Work)', () => {
  window.location = "https://keep.google.com/#LIST/1roXhEe7427O6lMXhBgJYc3HcB9CgRtnIQxzP0QT9tjgG1etxlZozCtCZzxCFkHoszhnT"
});

mapkey('qgkk', 'Google Keep', () => {
  window.location = "https://keep.google.com/#home"
});

mapkey('qgnc', 'Merge Requests', () => {
  window.location = "https://gitlab.netcup.net/dashboard/merge_requests?assignee_username=l.takacs"
});

mapkey('qgm', 'Merge Requests', () => {
  window.location = "https://music.youtube.com"
});

mapkey('qgdw', 'DeepL Write', () => {
  window.location = "https://www.deepl.com/write"
});
mapkey('qgc', 'Merge Requests', () => {
  window.location = "https://code.anexia.com/dashboard/merge_requests?assignee_username=ltakacs"
});

mapkey('qgv', 'Vault', () => {
  window.location = "https://vault-a8n.anexia-it.com/ui/vault/secrets"
});
mapkey('qgls', 'Localhost 1337', () => {
  window.location = "http://localhost:1337"
});
mapkey('qgbk', 'Benji liste', () => {
  window.location = "https://ais.anexia-it.com/pages/resumedraft.action?draftId=171769177&draftShareId=97564d6d-a335-433d-8e5e-9147985042eb&"
});
mapkey('qgln', 'Localhost 3000', () => {
  window.location = "http://localhost:3000"
});
mapkey('qgll', 'Localhost', () => {
  window.location = "http://localhost"
});

mapkey('qgnt', 'Notes tbd', () => {
  window.location = "https://ats.anexia-it.com/issues/?jql=project%20%3D%20AMS%20AND%20description%20~%20%22tbd%22"
});

mapkey('qgnn', 'Notes', () => {
  window.location = "https://ais.anexia-it.com/pages/resumedraft.action?draftId=158608983&draftShareId=0adbc26d-e032-4546-9676-2f14048da11e&"
});

mapkey('qge', 'Exchange', () => {
  window.location = "https://exchange.anexia.at"
});

mapkey('qgjb', 'Backlog', () => {
  window.location = "https://ats.anexia-it.com/secure/RapidBoard.jspa?rapidView=430&projectKey=AMS&view=planning.nodetail&quickFilter=2798&issueLimit=100"
});
mapkey('qgsb', 'Backlog', () => {
  window.location = "https://ats.anexia-it.com/secure/RapidBoard.jspa?rapidView=430&projectKey=AMS&view=planning.nodetail&quickFilter=2798&issueLimit=100"
});

mapkey('qgjs', 'Sprint', () => {
  window.location = "https://ats.anexia-it.com/secure/RapidBoard.jspa?rapidView=430&view=detail&selectedIssue=AMS-4357&quickFilter=2802&quickFilter=2798"
});
mapkey('qgr', 'Roadmap', () => {
  window.location = "https://ats.anexia-it.com/secure/PortfolioPlanView.jspa?id=58&sid=79&vid=178#plan/backlog"
});
mapkey('qglp', 'phpmyadmin', () => {
  window.location = "http://localhost:10083"
});

mapkey('qgaa', 'netcup AIS', () => {
  window.location = "https://ais.anexia-it.com/display/AM"
});

mapkey('qgna', 'netcup AIS', () => {
  window.location = "https://ais.anexia-it.com/display/ncm"
});

mapkey('qgda', 'Dev AIS', () => {
  window.location = "https://ais.anexia-it.com/display/MI/Development"
});

mapkey('qgadp', 'Development Projekte', () => {
  window.location = "https://ais.anexia-it.com/display/MI/Projekte"
});

mapkey('qgadd', 'Development AIS', () => {
  window.location = "https://ais.anexia-it.com/display/MI/Development"
});

mapkey('qgss', 'Sprint', () => {
  window.location = "https://ats.anexia-it.com/secure/RapidBoard.jspa?rapidView=430&view=detail&selectedIssue=AMS-4357&quickFilter=2802&quickFilter=2798"
});

mapkey('qgw', 'Intranet', () => {
  window.location = "https://web.whatsapp.com/"
});

mapkey('qgi', 'Intranet', () => {
  window.location = "https://intranet.anexia-it.com"
});

mapkey('qgjt', 'New Task', () => {
  window.location = "https://ats.anexia-it.com/secure/CreateIssueDetails!init.jspa?pid=12705&issuetype=10402"
});
mapkey('qgje', 'New Epic', () => {
  window.location = "https://ats.anexia-it.com/secure/CreateIssueDetails!init.jspa?pid=12705&issuetype=10000"
});

mapkey('qgi', 'Intranet', () => {
  window.location = "https://intranet.anexia-it.com"
});


mapkey('cdp', 'gitlab', async () => {
  const url = 'https://code.anexia.com/api/v4/groups/13/projects?include_subgroups=true';
  let response = await fetch(url);
  let data = await response.json();
  const projects = data.map(({name, web_url}) => {
    return {
      title: name,
      url: web_url
    }
  })
  Front.openOmnibar({type: "UserURLs", extra: projects});
}, {domain: /code.anexia.com/i})

mapkey('qgp', 'Protokoll', () => {
  window.location = "https://ais.anexia-it.com/pages/createpage.action?spaceKey=~LTakacs&fromPageId=143921605"
});

mapkey('qgt', 'Teams', () => {
  tabOpenLink("https://teams.microsoft.com");
});

mapkey('qj', 'Join', () => {
  if (window.location.href.indexOf("modern-calling") !== -1) {
    document.getElementById("prejoin-join-button").click()
  } else {
    const inputs = document.querySelectorAll('button[title="Join"]');
    if ([...inputs].length === 1) {
      inputs[0].click();
      return
    }

    Hints.create('button[title="Join"]', function (element) {
      element.click()
    });
  }
}, {domain: /teams.microsoft.com/i})

mapkey('qq', 'Mute', () => {
  document.getElementById("microphone-button").click()
}, {domain: /teams.microsoft.com/i})

mapkey('qq', 'Focus note', () => {
  Hints.create(".notranslate", Hints.dispatchMouseClick);
}, {domain: /keep.google.com/i})

mapkey('qtm', 'Teams', () => {
  const input = document.querySelector('[data-tid=calendar_header_open_meet_now_flyout_button]');
  input.click()
  setTimeout(() => {
    const input2 = document.querySelector('[data-tid=meet_now_calendar_flyout_get_meeting_link_button]');
    input2.click()

    setTimeout(() => {
      Clipboard.read(function ({data}) {
        tabOpenLink(data.trim())
      });
    }, 3000)
  }, 100)
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


mapkey('qmu', 'Post Links', () => {
  Hints.create('.post__body a[href]', function (element) {
    tabOpenLink(element.href);
  });
}, {domain: /mattermost.anexia-it.com/i})

mapkey('qmm', 'Post Menu', () => {
  [...document.querySelectorAll(".post")].pop().click()
  setTimeout(() => {
    [...document.querySelectorAll(".post-right-comments-container .post .post-menu__item")].pop().click()
  }, 1100)
}, {domain: /mattermost.anexia-it.com/i})

mapkey('qth', 'Intranet Home office', () => {
  document.querySelector("#my_location_14").click()
  document.querySelector("#clockin_default").click()
  setTimeout(() => {
    document.querySelector("#my-presence-info-submit").click()
  }, 500)
}, {domain: /intranet.anexia-it.com/i})

mapkey(';n', '#3mute/unmute current tab', 'RUNTIME("muteTab")');