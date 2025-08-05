import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import EmojiPicker from 'emoji-picker-react';
import 'react-quill/dist/quill.snow.css';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem',
    padding: '2rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    minHeight: '80vh',
    color: '#ffffff',
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    gap: '1rem',
  },
  editorContainer: {
    marginBottom: '2rem',
    width: '100%',
    '& .ql-container': {
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
      border: '1px solid #333333',
      fontSize: '16px',
    },
    '& .ql-toolbar': {
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
      backgroundColor: '#333333',
      border: '1px solid #333333',
      '& .ql-stroke': {
        stroke: '#ffffff',
      },
      '& .ql-fill': {
        fill: '#ffffff',
      },
      '& .ql-picker-label': {
        color: '#ffffff',
      },
      '& .ql-picker-options': {
        backgroundColor: '#333333',
        color: '#ffffff',
      },
    },
    '& .ql-editor': {
      fontSize: '16px',
      lineHeight: '1.5',
      color: '#ffffff',
      '&::before': {
        color: '#a0a0a0',
        fontSize: '16px',
      },
    },
  },
  editor: {
    height: '120px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
    position: 'relative',
    marginBottom: '2rem',
  },
  emojiPicker: {
    position: 'absolute',
    top: '50px',
    right: '10px',
    zIndex: 10,
    backgroundColor: '#2a2a2a',
    border: '1px solid #333333',
    borderRadius: '8px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
    '& .epr-dark-theme': {
      backgroundColor: '#2a2a2a',
      color: '#ffffff',
    },
  },
  listContainer: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    border: '1px solid #333333',
    minHeight: '200px',
  },
  list: {
    marginBottom: '5px',
    backgroundColor: '#2a2a2a',
    color: '#ffffff',
    borderBottom: '1px solid #333333',
    padding: '12px 16px',
    '&:hover': {
      backgroundColor: '#3a3a3a',
    },
    '& .MuiListItemText-primary': {
      color: '#ffffff',
      fontSize: '16px',
      fontWeight: '500',
      '& p': {
        margin: 0,
        fontSize: '16px',
        lineHeight: '1.5',
      },
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        color: '#ffffff',
        margin: '0.5rem 0',
      },
      '& strong': {
        color: '#ffffff',
        fontWeight: '600',
      },
      '& em': {
        color: '#d0d0d0',
      },
    },
    '& .MuiListItemText-secondary': {
      color: '#a0a0a0',
      fontSize: '14px',
      marginTop: '8px',
    },
  },
}));

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!task.trim()) {
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = {
        text: task,
        updatedAt: now,
        createdAt: newTasks[editIndex].createdAt,
      };
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task, createdAt: now, updatedAt: now }]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleEmojiClick = (emojiData) => {
    setTask((prevTask) => prevTask + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className={classes.root}>
      {/* Contêiner do Editor */}
      <div className={classes.editorContainer}>
        <ReactQuill
          className={classes.editor}
          value={task}
          onChange={setTask}
          theme="snow"
          placeholder="Digite sua tarefa aqui..."
          style={{
            fontSize: '16px',
          }}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link'],
              ['clean']
            ],
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'list', 'bullet',
            'link'
          ]}
        />
      </div>

      {/* Contêiner dos Botões */}
      <div className={classes.buttonContainer}>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          style={{
            color: '#ffffff',
            backgroundColor: '#437db5',
            boxShadow: 'none',
            borderRadius: "8px",
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#3a6da3',
            },
          }}
          onClick={handleAddTask}
        >
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
        <Button
          startIcon={<InsertEmoticonIcon />}
          style={{
            color: '#ffffff',
            backgroundColor: '#FFA500',
            boxShadow: 'none',
            borderRadius: "8px",
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#e6940a',
            },
          }}
          variant="contained"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        >
          {showEmojiPicker ? 'Fechar Emojis' : 'Inserir Emoji'}
        </Button>

        {/* Picker de Emojis Flutuante */}
        {showEmojiPicker && (
          <div className={classes.emojiPicker}>
            <EmojiPicker 
              onEmojiClick={handleEmojiClick}
              theme="dark"
              searchPlaceholder="Buscar emoji..."
              skinTonePickerLocation="PREVIEW"
              height={400}
              width={300}
            />
          </div>
        )}
      </div>

      {/* Lista de Tarefas */}
      <div className={classes.listContainer}>
        {tasks.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#a0a0a0',
            fontSize: '18px',
          }}>
            Nenhuma tarefa adicionada ainda.
            <br />
            <span style={{ fontSize: '16px', color: '#666' }}>
              Use o editor acima para criar sua primeira tarefa!
            </span>
          </div>
        ) : (
          <List>
            {tasks.map((task, index) => (
              <ListItem key={index} className={classes.list}>
                <ListItemText
                  primary={
                    <div
                      dangerouslySetInnerHTML={{ __html: task.text }}
                      style={{ 
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#ffffff',
                      }}
                    />
                  }
                  secondary={
                    <span style={{ 
                      color: '#a0a0a0', 
                      fontSize: '14px',
                      fontStyle: 'italic',
                    }}>
                      {new Date(task.updatedAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    onClick={() => handleEditTask(index)}
                    style={{
                      backgroundColor: '#4ec24e',
                      color: '#ffffff',
                      marginRight: '8px',
                      '&:hover': {
                        backgroundColor: '#45b045',
                      },
                    }}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteTask(index)}
                    style={{
                      backgroundColor: '#db6565',
                      color: '#ffffff',
                      '&:hover': {
                        backgroundColor: '#c55555',
                      },
                    }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </div>
  );
};

export default ToDoList;