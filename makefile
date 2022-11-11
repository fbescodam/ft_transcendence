# newtabi(){
#   osascript \
#     -e 'tell application "iTerm2" to tell current window to set newWindow to (create tab with default profile)'\
#     -e "tell application \"iTerm2\" to tell current session of newWindow to write text \"${@}\""
# }


define newtab
	osascript \
    -e 'tell application "iTerm2" to tell current window to set newWindow to (create tab with default profile)'\
    -e "tell application \"iTerm2\" to tell current session of newWindow to write text \"$(1)\""
endef

WORKDIR = ${shell pwd}

DOCKER=cd ${WORKDIR} && docker-compose up --build
BACKEND=cd ${WORKDIR}/backend && npm run dev
FRONTED=cd ${WORKDIR}/frontend && npm run dev


all: new_tabs db_migrate


new_tabs:
	$(call newtab,${DOCKER})
	$(call newtab,${FRONTED})
	$(call newtab,${BACKEND})

db_migrate: new_tabs
	while ! echo exit | nc localhost 3000; do sleep 5; done
	cd backend/prisma; npx prisma migrate dev --name init; npx ts-node --compiler-options {\"module\":\"CommonJS\"} seed.ts