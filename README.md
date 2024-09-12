# VIDEO CHAT WEB APPLICATION

![](public/LOBBY_PAGE.png)

![](public/ROOM_PAGE.png)

<p align="justify">
    <em>
        The web video chat application serves as a foundational simulation designed to provide essential virtual communication capabilities. Users can effortlessly enter virtual rooms and engage in straightforward, real-time conversations using their webcam and microphone. This basic simulation ensures clear and reliable video and audio quality, facilitating smooth interactions. While it offers a simplified model of video chat functionality, it effectively showcases key features, making it an excellent tool for understanding and experimenting with fundamental communication elements in an intuitive and accessible format.
    </em>
</p>

## 1. PROJECT

```
git clone https://github.com/BIN-PDT/WEBAPP_VIDEO_CHAT.git && rm -rf WEBAPP_VIDEO_CHAT/.git
```

<p align="justify">
    <em>
        Visit <a href="https://www.agora.io/">Agora</a> to register your account and create a new project.
        <ul>
            <li>In the "Basic Information" section, select the use case as <code>Social / Chatroom</code>.</li>
            <li>Navigate to the "Security" section and enable the <code>Primary Certificate</code>.</li>
            <li>Copy the <code>APP_ID</code> and <code>APP_CERTIFICATE</code> from your project and replace them in <code>a_core/settings.py</code> and <code>static/js/stream.js</code>.</li>
        </ul>
    </em>
</p>

## 2. VIRTUAL ENVIRONMENT

```
python -m venv .venv
```

```
.venv\Scripts\activate.bat
```

## 3. DEPENDENCY

```
python.exe -m pip install --upgrade pip
```

```
pip install -r requirements.txt
```

## 4. DATABASE

```
python manage.py migrate
```

## 5. RUN APPLICATION

```
python manage.py runserver
```
