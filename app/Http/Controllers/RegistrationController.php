<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateLoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests;
use Carbon\Carbon;
use Request;
use Response;
use Auth;
use DB;
use App\User;

class RegistrationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $role_id ;
        $registerReq = Request::all();
        // dd($registerReq);
        $v = \Validator::make($registerReq,[
            'email'       =>  'required|email',
            'password'    =>  'required|min:6',
        ]);

        if ($registerReq['role'] ==='seeker') {
            $role_id = 2;
        }else{
            $role_id = 3;
        }
        //echo "success";exit;
        $createUser = DB::table('users')->insertGetId([
                          'username' => $registerReq['username'], 
                          'email' => $registerReq['email'], 
                          'password' => bcrypt($registerReq['password']),
                          'role_id'  => $role_id,
                          'created_at'=> Carbon::now()
        ]);

        //echo "success";
        return response()->json(['status' => '200', 'email' => $registerReq['email'], 'roleId'=>$role_id, 'id' => $createUser]);
    }

    /**
     * [updateKnowSeeker description]
     * @return [type] [description]
     */
    public function updateKnowSeeker(){
        $requestUpdateSeeker = Request::all();
        $updateUser = DB::table('know_seeker')->insertGetId([
                          //'user_id'          => Auth::User()->user_id, 
                          'user_id'          => 8, 
                          'name'             => $requestUpdateSeeker['name'], 
                          'contact'          => $requestUpdateSeeker['contact'], 
                          'age_5_10'         => $requestUpdateSeeker['age_5_10'], 
                          'age_10_20'        => $requestUpdateSeeker['age_10_20'], 
                          'age_20_40'        => $requestUpdateSeeker['age_20_40'], 
                          'age_40'           => $requestUpdateSeeker['age_40'], 
                          'address'          => $requestUpdateSeeker['address'], 
                          'city'             => $requestUpdateSeeker['city'], 
                          'district'         => $requestUpdateSeeker['district'], 
                          'zip'              => $requestUpdateSeeker['zip'], 
                          'state'            => $requestUpdateSeeker['state'], 
                          'description'      => $requestUpdateSeeker['description'], 
                          'institution_name' => $requestUpdateSeeker['institution_name'], 
                          'created_at'=> Carbon::now()
        ]);
        
        /*$countTags  = $requestUpdateSeeker['categoryTags'];
        foreach ($variable as $key => $countTags) {
            $createRelation = DB::table('cat_seeker_relation')->insert([
                      'user_id'          => $requestUpdateSeeker['user_id'], 
                      'category_id'      => $countTags['id'],
                      'created_at'=> Carbon::now()
                ]);
        }*/
        return response()->json(['status' => '200', 'message' => 'Ok']);
    }

    /**
     * [updateTrainer update trainer details]
     * @return [type] [description]
     */
    public function updateTrainer(){
              $requestUpdateTrainer = Request::all();
              $updateTrainer = DB::table('trainer')->insertGetId([
                     'user_id'          => $requestUpdateTrainer['user_id'], 
                     'name'             => $requestUpdateTrainer['name'], 
                     'contact'          => $requestUpdateTrainer['contact'],
                     'address'          => $requestUpdateTrainer['address'], 
                     'city'             => $requestUpdateTrainer['city'], 
                     'zip'              => $requestUpdateTrainer['zipcode'], 
                     'state'            => $requestUpdateTrainer['state'], 
                     'domain_details'   => $requestUpdateTrainer['domain'],
                     'created_at'       => Carbon::now()

                ]);

        return response()->json(['status' => '200', 'message' => 'Ok']);

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
