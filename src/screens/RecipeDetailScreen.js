import { View, Text, ScrollView, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Categories from "../components/categories";
import FoodItems from "../components/recipes";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../redux/favoritesSlice";

export default function HomeScreen() {
    const [activeCategory, setActiveCategory] = useState("Chicken");
    const navigation = useNavigation();

    const categories = [
        { idCategory: "1", strCategory: "Beef", strCategoryThumb: "https://www.themealdb.com/images/category/beef.png" },
        { idCategory: "2", strCategory: "Chicken", strCategoryThumb: "https://www.themealdb.com/images/category/chicken.png" },
        { idCategory: "3", strCategory: "Dessert", strCategoryThumb: "https://www.themealdb.com/images/category/dessert.png" },
    ];

    const allFood = [
        { category: 'Beef', idFood: '1', recipeName: "Beef and Mustard Pie", recipeImage: "https://images.unsplash.com/photo-1587248720327-8eb72564be1e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", recipeInstructions: "Cook beef with mustard...", ingredients: [{ ingredientName: "Beef", measure: "1kg" }] },
        { category: 'Chicken', idFood: '7', recipeName: "Chicken Curry", recipeImage: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", recipeInstructions: "Cook chicken with spices...", ingredients: [{ ingredientName: "Chicken", measure: "500g" }] },
    ];

    const handleChangeCategory = (category) => {
        setActiveCategory(category);
    };

    const filteredfoods = allFood.filter((food) => food.category === activeCategory);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer} testID="scrollContainer">
                <View style={styles.headerContainer} testID="headerContainer">
                    <Image source={{ uri: 'https://cdn.pixabay.com/photo/2017/02/23/13/05/avatar-2092113_1280.png' }} style={styles.avatar} />
                    <Text style={styles.greetingText}>Hello, User!</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Make your own food,</Text>
                    <Text style={styles.subtitle}>
                        stay at <Text style={styles.highlight}>home</Text>
                    </Text>
                </View>

                <View testID="categoryList">
                    <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View>

                <View testID="foodList">
                    <FlatList
                        data={filteredfoods}
                        keyExtractor={(item) => item.idFood}
                        numColumns={2}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={styles.cardContainer}
                                onPress={() => navigation.navigate("RecipeDetail", { recipe: item })}
                            >
                                <Image source={{ uri: item.recipeImage }} style={styles.articleImage} />
                                <Text style={styles.articleText}>{item.recipeName}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    scrollContainer: {
        paddingBottom: 50,
        paddingTop: hp(14),
    },
    headerContainer: {
        marginHorizontal: wp(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: hp(2),
        marginTop: hp(-8.5),
    },
    avatar: {
        height: hp(5),
        width: hp(5.5),
    },
    greetingText: {
        fontSize: hp(1.7),
        color: "#52525B",
        fontWeight: "600",
        backgroundColor: "#F3F4F6",
        paddingHorizontal: wp(2),
        paddingVertical: hp(0.5),
        borderRadius: 9999,
        textAlign: "center",
    },
    titleContainer: {
        marginHorizontal: wp(4),
        marginBottom: hp(2),
    },
    title: {
        fontSize: hp(3.8),
        fontWeight: "600",
        color: "#52525B",
    },
    subtitle: {
        fontSize: hp(3.8),
        fontWeight: "600",
        color: "#52525B",
    },
    highlight: {
        color: "#F59E0B",
    },
    cardContainer: {
        flex: 1,
        margin: wp(2),
        alignItems: "center",
    },
    articleImage: {
        width: "100%",
        height: hp(20),
        borderRadius: 15,
    },
    articleText: {
        fontSize: hp(2),
        fontWeight: "600",
        color: "#52525B",
        textAlign: "center",
        marginTop: hp(1),
    },
});
