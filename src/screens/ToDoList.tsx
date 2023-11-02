import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../assets/utilities/colors";

const ToDoList = () => {
   const [addNewItem, setAddNewItem] = useState('');
   const [todoItems, setTodoItems] = useState<string[]>([]);
   const [editingIndex, setEditingIndex] = useState<number | null>(null);
   const [showAdd, setShowAdd] = useState(false);
   const [editedText, setEditedText] = useState("");
   useEffect(() => {
      loadItems();
   }, []);

   const loadItems = async () => {
      try {
         const savedItems = await AsyncStorage.getItem('todoItems');
         if (savedItems !== null) {
            setTodoItems(JSON.parse(savedItems))
         }
      } catch (error) {
         console.error("Error loading items:", error);
      }
   }

   const saveItems = async (items: string[]) => {
      try {
         await AsyncStorage.setItem('todoItems', JSON.stringify(items));
      } catch (error) {
         console.error("Error saving item:", error)
      }
   }

   const addItem = () => {
      if (addNewItem.trim() !== "") {
         const updatedItems = [...todoItems, addNewItem]
         setTodoItems(updatedItems);
         setAddNewItem('');
         setShowAdd(false);
         saveItems(updatedItems);
      }
   };

   const editItem = (index: number) => {
      if (editedText.trim() !== "") {
         const updatedItems = [...todoItems];
         updatedItems[index] = editedText;
         setTodoItems(updatedItems);
         setEditedText("")
         setEditingIndex(null)
         saveItems(updatedItems);
      }
   }

   const deleteItemAlert = (index: number) => {
      Alert.alert(
         "Confirm Deletion",
         "Are you sure you want to delete this item?",
         [
            {
               text: "Cancel",
               style: "cancel",
            },
            {
               text: "Delete",
               onPress: () => deleteItem(index),
            },
         ]
      );
   };

   const deleteItem = (index: number) => {
      const updatedItems = [...todoItems];
      updatedItems.splice(index, 1);
      setTodoItems(updatedItems);
      saveItems(updatedItems);
   }

   return (
      <View style={styles.container}>
         <View style={styles.headingContainer}>
            <Text style={styles.heading}>My To do list</Text>
         </View>
         {todoItems.length === 0 ? (
            <View style={styles.emptyContainer}>
               <Image style={styles.pen} tintColor={Colors.White} source={require('../assets/icons/pen.png')} />
               <Text style={styles.emptyText}>Your List Looks Empty</Text>
            </View>
         ) : (
            <View style={styles.middleHeight}>
               <FlatList
                  data={todoItems}
                  renderItem={({ item, index }) => (
                     <View style={styles.todoContainer}>
                        <View style={styles.fdRow}>
                           {editingIndex === index ? (
                              <TextInput
                                 style={styles.inputStyle}
                                 value={editedText || item}
                                 onChangeText={(text) => setEditedText(text)}
                              />
                           ) : (
                              <Text style={styles.todoTitle}>{item}</Text>
                           )}

                           <View style={styles.iconContainer}>
                              {editingIndex === index ? (
                                 <TouchableOpacity onPress={() => editItem(index)} style={styles.icons}>
                                    <Image resizeMode="contain" source={require('../assets/icons/check.png')} />
                                 </TouchableOpacity>
                              ) : (
                                 <TouchableOpacity style={styles.icons} onPress={() => setEditingIndex(index)}>
                                    <Image resizeMode="contain" source={require('../assets/icons/edit.png')} />
                                 </TouchableOpacity>
                              )}
                              <TouchableOpacity style={styles.icons} onPress={() => deleteItemAlert(index)}>
                                 <Image source={require('../assets/icons/delete.png')} />
                              </TouchableOpacity>
                           </View>
                        </View>
                     </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
               />
            </View>
         )}

         {
            showAdd ? (
               <View style={styles.bottomInputContainer}>
                  <TextInput style={styles.input} value={addNewItem}
                     onChangeText={(text) => setAddNewItem(text)}
                     placeholder="Add new items"
                     placeholderTextColor={Colors.White}
                  />
                  <TouchableOpacity onPress={addItem} style={styles.addButton}>
                     <Image source={require('../assets/icons/plus.png')} />
                  </TouchableOpacity>

               </View>
            ) : (
               <View style={styles.bottom}>
                  <TouchableOpacity style={styles.add} onPress={() => setShowAdd(true)}>
                     <Image source={require('../assets/icons/plus.png')} />
                  </TouchableOpacity>
               </View>

            )
         }
      </View>
   )

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.Primary
   },
   headingContainer: {
      height: '20%',
      justifyContent: 'center'
   },
   emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '70%'
   },
   pen: {
      height: 150,
      width: 150,
   },
   emptyText: {
      color: Colors.White,
      fontSize: 25,
      marginTop: 20
   },
   middleHeight: {
      height: '70%'
   },
   fdRow: {
      flexDirection: 'row'
   },
   inputStyle: {
      color: Colors.White,
      flex: 1
   },
   todoContainer: {
      width: '90%',
      marginBottom: '5%',
      borderRadius: 10,
      backgroundColor: Colors.Secondary,
      justifyContent: 'center',
      alignSelf: 'center',
      height: 50,
   },
   todoTitle: {
      marginLeft: 5,
      fontWeight: "bold",
      color: 'white',
      width: '80%',
   },
   icons: {
      alignItems: "center",
      justifyContent: 'center',
      marginRight: 10
   },
   heading: {
      color: Colors.White,
      fontSize: 25,
      marginLeft: '5%',
      marginTop: 5,
      marginBottom: 5,
   },
   bottom: {
      position: 'absolute',
      bottom: 0,
      right: '5%',
      justifyContent: "center",
      alignItems: 'center',
      height: '10%'
   },
   iconContainer: {
      position: 'absolute',
      right: 0,
      flexDirection: 'row',
      height: '100%'
   },
   add: {
      height: 50,
      width: 50,
      borderRadius: 25,
      backgroundColor: Colors.Add,
      alignItems: 'center',
      justifyContent: 'center'
   },
   input: {
      marginBottom: 10,
      borderRadius: 5,
      padding: 10,
      flex: 1,
      backgroundColor: Colors.Secondary,
      color: Colors.White,
      width: '80%'
   },
   bottomInputContainer: {
      flexDirection: 'row',
      bottom: 0,
      position: 'absolute',
      width: '95%',
      alignSelf: 'center',
      justifyContent: 'center'
   },
   addButton: {
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: Colors.Check,
      marginBottom: 10,
      width: 50,
      height: 50,
      borderRadius: 25
   }
})

export default ToDoList;