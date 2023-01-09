FROM python:3.8.5

RUN apt-get update && apt-get install -y curl
RUN apt-get install -y git
RUN pip install --upgrade pip --trusted-host pypi.org --trusted-host files.pythonhosted.org
RUN pip install flask --trusted-host pypi.org --trusted-host files.pythonhosted.org

ADD . /app
WORKDIR /app

RUN pip install -r requirements.txt

EXPOSE 5001

CMD [ "python", "-u", "app.py" ]

