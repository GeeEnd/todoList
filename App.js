// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import Task from './components/Task';
import { db } from './firebase';  // Import the Firestore instance
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [filteredTaskItems, setFilteredTaskItems] = useState([]); // State for filtered tasks

  // Fetch tasks from Firestore on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTaskItems(tasks);
      setFilteredTaskItems(tasks);  // Initialize with all tasks
    };
    fetchTasks();
  }, []);

  // Filter tasks based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredTaskItems(taskItems); // Show all tasks if search query is empty
    } else {
      setFilteredTaskItems(
        taskItems.filter(task => task.text.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }, [searchQuery, taskItems]);

  const handleAddTask = async () => {
    Keyboard.dismiss();
    if (task) {
      // Add task to Firestore
      const docRef = await addDoc(collection(db, 'tasks'), { text: task });
      const newTask = { id: docRef.id, text: task };
      setTaskItems([...taskItems, newTask]);
      setTask('');
    }
  };

  const completeTask = async (id, index) => {
    try {
      // Delete task from Firestore
      await deleteDoc(doc(db, 'tasks', id));
      let itemsCopy = [...taskItems];
      itemsCopy.splice(index, 1);
      setTaskItems(itemsCopy);
    } catch (error) {
      console.error('Error removing task: ', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main View */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>

          {/* Search Bar */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
          <View style={styles.items}>
            {filteredTaskItems.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => completeTask(item.id, index)}>
                <Task text={item.text} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Task Input */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput
          style={styles.input}
          placeholder={'Write a task'}
          value={task}
          onChangeText={text => setTask(text)}
        />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED',
  },
  searchInput: {
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFF',
    borderRadius: 30,
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  addText: {},
});
