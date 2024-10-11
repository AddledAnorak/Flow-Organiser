from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
import uvicorn
import json
import os
import jwt
from jwt.exceptions import InvalidTokenError
from bson import ObjectId
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from datetime import timedelta, datetime, timezone
from passlib.context import CryptContext

load_dotenv()


class SetStateRequest(BaseModel):
    name: str
    id: str
    nodes: List[dict]
    edges: List[dict]

class RenameFlowRequest(BaseModel):
    name: str
    id: str

class Token(BaseModel):
    access_token: str
    token_type: str

def read_data():
    global data
    with open("data.json", "r") as f:
        data = json.load(f)


def write_data():
    with open("data.json", "w") as f:
        json.dump(data, f, indent=4)


app = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
USERNAME = os.getenv("FLOW_USERNAME")
PASSWORD = os.getenv("FLOW_PASSWORD")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

data = {}
read_data()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def validate_token(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        print(username, USERNAME)

        if username != USERNAME:
            raise credentials_exception
    except InvalidTokenError:
        print('invalid token')
        raise credentials_exception
    return True



def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    print(form_data.username, USERNAME, form_data.password, PASSWORD)
    if form_data.username != USERNAME or form_data.password != PASSWORD:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token_expires = timedelta(days=1)
    access_token = create_access_token(
        data={"sub": form_data.username}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")



@app.get("/flowlist")
def get_all_flows(token: Annotated[bool, Depends(validate_token)]):
    return [{
        'name': flow['name'],
        'id': flow['id']
    } for flow in data.values()]


@app.get("/state/{id}")
def get_state(token: Annotated[bool, Depends(validate_token)], id: str):
    if id not in data:
        raise HTTPException("No flows found")
    
    return data[id]


@app.post("/state")
def set_state(token: Annotated[bool, Depends(validate_token)], request: SetStateRequest):
    if request.id not in data:
        raise HTTPException("No flows found")
    
    data[request.id] = {
        'name': request.name,
        'id': request.id,
        'nodes': request.nodes,
        'edges': request.edges
    }

    write_data()


@app.post('/rename')
def rename_flow(token: Annotated[bool, Depends(validate_token)], request: RenameFlowRequest):
    if request.id not in data:
        raise HTTPException("No flows found")
    
    data[request.id] = {
        'name': request.name,
        'id': request.id,
        'nodes': data[request.id]['nodes'],
        'edges': data[request.id]['edges']
    }

    write_data()


@app.post("/newflow")
def new_flow(token: Annotated[bool, Depends(validate_token)]):
    new_id = str(ObjectId())
    data[new_id] = {
        'name': 'Untitled Flow',
        'id': new_id,
        'nodes': [],
        'edges': []
    }

    write_data()

    return new_id


@app.delete("/{id}")
def delete_flow(token: Annotated[bool, Depends(validate_token)], id: str):
    if id not in data:
        raise HTTPException("No flows found")
    
    del data[id]
    write_data()




if __name__ == "__main__":
    uvicorn.run(app)