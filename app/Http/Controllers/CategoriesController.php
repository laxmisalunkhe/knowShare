<?php

namespace App\Http\Controllers;

use App\Categories;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // dd(Categories::all());    
       
        $getAllCategories = DB::table('categories')->select('id', 'category_name')->get();
        // dd($getAllCategories);
        return $getAllCategories;
    }

    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

}
