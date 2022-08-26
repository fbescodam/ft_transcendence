# **************************************************************************** #
#                                                                              #
#                                                         ::::::::             #
#    Makefile                                           :+:    :+:             #
#                                                      +:+                     #
#    By: W2Wizard <main@w2wizard.dev>                 +#+                      #
#                                                    +#+                       #
#    Created: 2022/08/26 13:26:37 by W2Wizard      #+#    #+#                  #
#    Updated: 2022/08/26 13:26:40 by W2Wizard      ########   odam.nl          #
#                                                                              #
# **************************************************************************** #

up:
	docker-compose up -d --build

stop:
	docker-compose down -v

clean: stop

re: clean up
